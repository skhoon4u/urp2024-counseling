# test_model.py

from transformers import BlenderbotSmallTokenizer, BlenderbotSmallForConditionalGeneration
import torch
import os

def load_trained_model(checkpoint_dir, from_tf=False):
    try:
        tokenizer = BlenderbotSmallTokenizer.from_pretrained(checkpoint_dir)
        model = BlenderbotSmallForConditionalGeneration.from_pretrained(checkpoint_dir, from_tf=from_tf)
        return tokenizer, model
    except Exception as e:
        print("모델 로드 중 오류 발생:", e)
        raise e

def generate_response(tokenizer, model, device, user_message):
    inputs = tokenizer(user_message, return_tensors='pt').input_ids.to(device)
    with torch.no_grad():
        reply_ids = model.generate(inputs, max_length=50, min_length=5, do_sample=True, temperature=0.7, top_p=0.9, top_k=50, num_beams=1, repetition_penalty=1.2, no_repeat_ngram_size=3, early_stopping=True)
    bot_response = tokenizer.decode(reply_ids[0], skip_special_tokens=True)
    return bot_response

if __name__ == "__main__":
    save_dir = './'
    checkpoint_path = os.path.join(save_dir, 'finetuned_blenderbot')  # 경로 수정 가능
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    try:
        tokenizer, model = load_trained_model(checkpoint_path, from_tf=False)
        model.to(device)
        model.eval()
        print(f"모델이 {device}로 이동되었습니다.")
        
        # 테스트 메시지
        user_message = "Hi, how are you?"
        response = generate_response(tokenizer, model, device, user_message)
        print(f"User: {user_message}")
        print(f"Bot: {response}")
    except Exception as e:
        print("테스트 중 오류 발생:", e)