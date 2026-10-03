# Dockerfile for deploying the fine-tuned Gemma 4 model on DigitalOcean GPU Droplets
FROM nvidia/cuda:12.1.1-runtime-ubuntu22.04

# Install python and pip
RUN apt-get update && apt-get install -y python3 python3-pip

WORKDIR /app

# In a real environment, we would use vLLM or Ollama for serving Gemma 4
RUN pip3 install vllm 

# Copy the fine-tuned Tinker weights
COPY ./model-weights /app/model-weights

# Start the inference server on port 8000
CMD ["python3", "-m", "vllm.entrypoints.openai.api_server", "--model", "/app/model-weights", "--port", "8000"]
