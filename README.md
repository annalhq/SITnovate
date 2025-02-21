<h3 align="center">✨ TruthSeek: Transformer based email spam classifier</h3>

<div align="center">
  <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" />
  <img src="https://img.shields.io/badge/🤗 HuggingFace-000000?style=for-the-badge&logo=husky&logoColor=white" alt="huggingface" />
  <img src="https://img.shields.io/badge/Ollama-FFFFFF?style=for-the-badge&logo=Ollama&logoColor=black" />
  <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="nextdotjs" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcn/ui&logoColor=white"/>
</div>

## Table of Contents
- [Introduction](#introduction)
- [Contributors](#contributors)
- [Analytics](#analytics)

## Introduction

TruthSeek is an advanced email classifier that leverages a multi-stage architecture combining RoBERTa with CNN and a hierarchical attention network. This approach ensures high accuracy in distinguishing spam from legitimate emails. It is a multi-modal system that takes into consideration email protocols like DMARC, SPF, and DKIM. Additionally, it uses web agents to verify the authenticity of email senders, enhancing the reliability of the classification process.

### Model Architecture
1. **RoBERTa**: Utilized for initial text encoding.
2. **CNN**: Applied for feature extraction from encoded text.
3. **BiLSTM**: Used for sentence-level embedding to capture context from both directions.
4. **Hierarchical Attention Network**: Enhances the model's focus on important words and sentences.

<div align="center">
  <img src="public/architecture.png" alt="Model Architecture" />
</div>

### Model Links

- [RoBERTa Model on HuggingFace](https://huggingface.co/annalhq/truthseek)

## Contributors
<img src="https://contrib.rocks/image?repo=annalhq/truthseek" alt="Contributors"/>

## Analytics
![Alt](https://repobeats.axiom.co/api/embed/50dc57db333fa63a964001acda2ddf3ea4886946.svg "Repobeats analytics image")