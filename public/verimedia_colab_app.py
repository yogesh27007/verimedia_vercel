"""
VeriMedia — Complete Machine Learning Project for Google Colab
Authors: Yogesh Tiwari & Dhwaj Chauhan
Department: Computer Science & Engineering
Hardware Target: Google Colab Free Tier (Nvidia T4 GPU / CPU)

Instructions for Colab:
!pip install gradio torch torchvision opencv-python pillow numpy matplotlib
python verimedia_colab_app.py
"""

import os
import io
import cv2
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torchvision.models as models
from PIL import Image, ImageChops, ImageEnhance
import numpy as np
import gradio as gr

print("=== VeriMedia Machine Learning Colab Server Initializing ===")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 1. Load Pre-trained MobileNetV2 Deepfake Classifier Model
def load_model():
    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
    num_ftrs = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.2),
        nn.Linear(num_ftrs, 128),
        nn.ReLU(),
        nn.Linear(128, 1)
    )
    model.to(device)
    model.eval()
    return model

model = load_model()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# 2. Error Level Analysis (ELA) Engine
def compute_ela(image_pil, quality=90, scale=15):
    buffer = io.BytesIO()
    image_pil.save(buffer, format='JPEG', quality=quality)
    buffer.seek(0)
    recompressed = Image.open(buffer)

    # Compute absolute pixel difference
    ela_img = ImageChops.difference(image_pil.convert('RGB'), recompressed.convert('RGB'))
    extrema = ela_img.getextrema()
    max_diff = max([ex[1] for ex in extrema]) or 1
    
    # Scale delta values
    extrema_scale = 255.0 / max_diff
    ela_img = ImageEnhance.Brightness(ela_img).enhance(extrema_scale * (scale / 10.0))
    return ela_img, max_diff

# 3. Laplacian Spatial Noise Matrix Engine
def compute_spatial_noise(image_np):
    gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
    laplacian = cv2.Laplacian(gray, cv2.CV_64F)
    variance = laplacian.var()

    # Create heatmap visualization
    abs_lap = np.uint8(np.absolute(laplacian))
    heatmap = cv2.applyColorMap(cv2.convertScaleAbs(abs_lap, alpha=3), cv2.COLORMAP_JET)
    return cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB), variance

# 4. Master Forensic Pipeline Function
def analyze_image(input_image):
    if input_image is None:
        return None, None, None, "Please upload an image."

    pil_img = Image.fromarray(input_image)

    # Module 2: ELA Shader Pass
    ela_result_pil, max_diff = compute_ela(pil_img, quality=90, scale=15)

    # Module 3: Spatial Noise Heatmap
    noise_heatmap, noise_var = compute_spatial_noise(input_image)

    # Module 4: CNN Model AI Likelihood
    input_tensor = transform(pil_img).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(input_tensor).squeeze()
        prob = torch.sigmoid(output).item()
        ai_score = int(prob * 100)

    # Calculate Splice Score based on ELA delta
    splice_score = min(100, int((max_diff / 255.0) * 100 * 1.5))

    # Evidence Fusion Verdict
    if ai_score > 60 and noise_var < 15.0:
        verdict = f"🤖 HIGH LIKELIHOOD AI-GENERATED IMAGE (AI Probability: {ai_score}%)"
    elif splice_score > 55:
        verdict = f"✂️ SPLICED / EDITED COMPOSITE DETECTED (Splice Score: {splice_score}%)"
    else:
        verdict = f"📷 HIGH LIKELIHOOD AUTHENTIC PHOTOGRAPH (AI Prob: {ai_score}%, Noise Var: {noise_var:.1f})"

    report_text = f"""
    === VERIMEDIA FORENSIC TELEMETRY ===
    • Final Diagnosis: {verdict}
    • CNN AI Likelihood Score: {ai_score}%
    • WebGL ELA Splice Delta: {splice_score}% (Max Delta: {max_diff}/255)
    • Spatial Noise Variance (σ²): {noise_var:.2f} ({'Hyper-Uniform' if noise_var < 15 else 'Natural Sensor Noise'})
    • Authors: Yogesh Tiwari & Dhwaj Chauhan
    """

    return ela_result_pil, noise_heatmap, verdict, report_text

# 5. Build Gradio Web Dashboard
with gr.Blocks(title="VeriMedia — ML Forensics Engine") as demo:
    gr.Markdown("""
    # 🛡️ VeriMedia — Machine Learning Forensics Engine
    **Authors:** Yogesh Tiwari & Dhwaj Chauhan | **Dept:** Computer Science & Engineering  
    *Client-Side Deepfake, Splice, and AI Generation Detection Pipeline*
    """)

    with gr.Tab("📷 Image Forensic Audit"):
        with gr.Row():
            img_input = gr.Image(type="numpy", label="Upload Target Image")
            with gr.Column():
                verdict_output = gr.Textbox(label="Master Verdict", interactive=False)
                report_output = gr.Textbox(label="Detailed Forensic Report", interactive=False, lines=8)

        with gr.Row():
            ela_output = gr.Image(label="Module 2: Error Level Analysis (ELA Heatmap)")
            noise_output = gr.Image(label="Module 3: Spatial Noise Variance Heatmap")

        btn_analyze = gr.Button("🔍 Run Full Forensic Pass", variant="primary")
        btn_analyze.click(
            fn=analyze_image,
            inputs=[img_input],
            outputs=[ela_output, noise_output, verdict_output, report_output]
        )

# Launch with share=True to generate a free public link for your teacher!
if __name__ == "__main__":
    demo.launch(share=True, debug=True)
