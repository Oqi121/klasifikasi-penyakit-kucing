# backend/main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from ultralytics import YOLO

app = FastAPI()

# Allow CORS (untuk frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO("model/best.pt")  

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    
    results = model.predict(image)
    label = results[0].names[int(results[0].probs.top1)]
    confidence = float(results[0].probs.top1conf)

    return {
        "prediction": label,
        "confidence": confidence
    }
