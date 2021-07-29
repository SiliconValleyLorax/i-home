# i-home backend

## file tree

backend
├── apiserver
│   ├── static
│   │   └── imagenet_class_index.json
│   ├── .gitignore
│   ├── app.py
│   ├── Book.xlsx
│   ├── config.py
│   ├── Dockerfile
│   ├── models.py
│   ├── requirements.txt
│   ├── translate.py
│   └── wsgi.py
├── elasticsearch
│   ├── config
│   │   └── elasticsearch.yml
│   └── Dockerfile
├── modelserver
│   ├── object_detection
│   │   ├── core/...
│   │   ├── dist/...
│   │   ├── inference_graph/...
│   │   ├── object_detection.egg-info/...
│   │   ├── packages/...
│   │   ├── protos/...
│   │   ├── training/...
│   │   └── utils/
│   ├── .gitignore
│   ├── AI.py
│   ├── app.py
│   ├── config.py
│   ├── Dockerfile
│   ├── elastic.py
│   ├── requirements.txt
│   ├── setup.py
│   ├── tasks.py
│   └── wsgi.py
├── postgres
│   ├── create.sql
│   └── Dockerfile
└── README.md