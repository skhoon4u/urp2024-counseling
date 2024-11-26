# chatbot_service.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import BlenderbotSmallTokenizer, BlenderbotSmallForConditionalGeneration
import torch
import logging
import os

app = Flask(__name__)
CORS(app)  # 모든 도메인에서의 접근을 허용

# 로깅 설정
logging.basicConfig(level=logging.INFO)

# 모델 저장 디렉토리 설정
# 사용자가 직접 수정할 수 있도록 변수로 설정
save_dir = './'

def load_trained_model(checkpoint_dir, from_tf=False):
    try:
        logging.info(f"모델 로드 중: {checkpoint_dir}")
        tokenizer = BlenderbotSmallTokenizer.from_pretrained(checkpoint_dir)
        model = BlenderbotSmallForConditionalGeneration.from_pretrained(checkpoint_dir, from_tf=from_tf)
        logging.info("모델과 토크나이저 로드 완료")
        return tokenizer, model
    except Exception as e:
        logging.error("모델 로드 중 오류 발생:", exc_info=True)
        raise e

# 모델 로드 (Flask 서버 시작 시 한 번만 로드)
try:
    checkpoint_path = os.path.join(save_dir, 'finetuned_blenderbot')
    tokenizer, model = load_trained_model(checkpoint_path, from_tf=False)  # 필요 시 from_tf=True 설정
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval()
    logging.info(f"모델이 {device}로 이동되었습니다.")
except Exception as e:
    logging.error("초기 모델 로드 실패:", exc_info=True)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message')
        
        if not user_message:
            logging.warning("메시지가 제공되지 않았습니다.")
            return jsonify({'error': 'No message provided'}), 400

        logging.info(f"받은 메시지: {user_message}")
        
        # 대화 내역 관리 (최대 6개)
        if 'conversation_history' not in request.cookies:
            conversation_history = []
        else:
            conversation_history = request.cookies.get('conversation_history').split('|')
        
        conversation_history.append(user_message)
        if len(conversation_history) > 6:
            conversation_history.pop(0)
        
        # EoS 토큰 추가
        conversation_history_with_eos = [f"{utt} {tokenizer.eos_token}" for utt in conversation_history]
        input_text = ' '.join(conversation_history_with_eos)

        # 입력 문장을 토큰화
        inputs = tokenizer(input_text, return_tensors='pt', max_length=512, truncation=True).input_ids.to(device)

        # 모델을 사용하여 응답 생성
        logging.info("모델을 사용하여 응답 생성 중...")
        reply_ids = model.generate(
            inputs,
            max_length=50,
            min_length=5,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
            top_k=50,
            num_beams=1,  # num_beams를 1로 설정하여 응답 시간 단축
            repetition_penalty=1.2,
            no_repeat_ngram_size=3,
            early_stopping=True
        )
        bot_response = tokenizer.decode(reply_ids[0], skip_special_tokens=True)

        logging.info(f"생성된 응답: {bot_response}")

        # 대화 내역 업데이트
        conversation_history.append(bot_response)
        if len(conversation_history) > 6:
            conversation_history.pop(0)
        updated_history = '|'.join(conversation_history)

        # 쿠키에 대화 내역 저장 (선택 사항)
        response = jsonify({'response': bot_response})
        response.set_cookie('conversation_history', updated_history)

        return response

    except Exception as e:
        logging.error("채팅 처리 중 오류 발생:", exc_info=True)
        return jsonify({'error': 'An error occurred while processing the message.'}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)