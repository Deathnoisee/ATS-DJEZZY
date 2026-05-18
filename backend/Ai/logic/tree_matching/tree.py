import json
import os
from Ai.logic.tree_matching.treeLogic.tree_builder import tree_builder

_NORM_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "../LLM_extraction/normalization.json"
)

def load_normalization():
    with open(_NORM_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def apply_normalization(name, rules):
    key = str(name).strip()
    return rules.get(key, rules.get(key.lower(), key.lower()))

def add_children(parent, rules, *names):
    for name in names:
        parent.add_child(tree_builder(apply_normalization(name, rules)))

def add_tree(parent, rules, subtree):
    for name, children in subtree.items():
        node = tree_builder(apply_normalization(name, rules))
        parent.add_child(node)
        if isinstance(children, dict):
            add_tree(node, rules, children)
        else:
            add_children(node, rules, *children)

def build_sample_tree():
    rules = load_normalization()
    root = tree_builder("skills")

    branches = {
        "Languages": {
            "Programming Languages": {
                "Dynamic Languages": ["Python", "JavaScript", "PHP", "Ruby"],
                "Static Languages": ["Java", "TypeScript", "C#", "C++", "Go", "Rust"],
            }
        },
        "Frameworks & Libraries": {
            "Web Frameworks": {
                "Python Web Frameworks": ["Django", "Flask", "FastAPI"],
                "JavaScript Web Frameworks": ["Express.js", "Next.js", "Nuxt.js", "Node.js"],
                "Java Web Frameworks": ["Spring Boot"],
                "PHP Web Frameworks": ["Laravel"],
                "Ruby Web Frameworks": ["Ruby on Rails"],
                "C# Web Frameworks": ["ASP.NET Core"],
                "Go Web Frameworks": ["Gin", "Fiber", "Echo"],
                "Rust Web Frameworks": ["Actix"],
            },
            "Frontend Frameworks": {
                "React Ecosystem": ["React", "Preact", "Next.js", "Gatsby"],
                "Vue Ecosystem": ["Vue", "Nuxt.js"],
                "Angular Ecosystem": ["Angular"],
                "Compile-time UI": ["Svelte", "SolidJS", "Qwik"],
                "Other Frontend": ["Ember.js", "Alpine.js", "Lit"],
            },
            "Backend Frameworks": {
                "Node.js Backend Frameworks": ["NestJS", "Hapi", "AdonisJS"],
                "Java Backend Frameworks": ["Spring"],
                "Go Backend Frameworks": ["Gin", "Fiber", "Echo"],
                "Rust Backend Frameworks": ["Actix"],
                "Kotlin Backend Frameworks": ["Ktor"],
            },
            "Mobile Frameworks": {
                "Cross-Platform Mobile": [
                    "Flutter", "React Native", ".NET MAUI", "Ionic",
                    "Xamarin", "NativeScript", "Kotlin Multiplatform", "Capacitor"
                ],
                "Native UI": ["SwiftUI", "Jetpack Compose"],
            },
            "Testing Frameworks": {
                "Python Testing": ["pytest"],
                "Java Testing": ["JUnit", "TestNG"],
                "JavaScript Testing": ["Jest", "Mocha", "Vitest", "Supertest"],
                "E2E Testing": ["Cypress", "Playwright", "Selenium"],
                ".NET Testing": ["NUnit"],
            },
            "Data Libraries": {
                "Python Data Libraries": [
                    "pandas", "NumPy", "SciPy", "Polars", "Dask",
                    "Matplotlib", "Seaborn"
                ],
                "Distributed Data": ["PySpark", "Apache Arrow"],
                "Computer Vision": ["OpenCV"],
            },
            "Machine Learning Libraries": {
                "Classical ML": ["scikit-learn", "XGBoost", "LightGBM", "CatBoost"],
                "Deep Learning": ["TensorFlow", "PyTorch", "Keras", "JAX", "MXNet"],
                "NLP & LLMs": ["Hugging Face Transformers"],
            },
            "UI Libraries": {
                "React UI": [
                    "Material UI", "Ant Design", "Chakra UI",
                    "Radix UI", "shadcn/ui", "Mantine"
                ],
                "CSS Frameworks": ["Bootstrap", "Tailwind CSS"],
                "Vue UI": ["Vuetify"],
                "Other UI": ["Semantic UI"],
            },
            "ORMs": {
                "Python ORMs": ["SQLAlchemy", "Django ORM"],
                "Java ORMs": ["Hibernate"],
                ".NET ORMs": ["Entity Framework"],
                "JS/TS ORMs": ["Prisma", "Sequelize", "TypeORM"],
                "PHP ORMs": ["Doctrine", "Eloquent"],
            },
        },
        "Databases": {
            "Relational Databases": {
                "SQL Databases": [
                    "PostgreSQL", "MySQL", "SQLite", "SQL Server", "Oracle",
                    "MariaDB", "CockroachDB", "Amazon Aurora", "IBM Db2", "Firebird"
                ]
            },
            "Database Concepts": {
                "Query Languages": ["SQL"],
                "Paradigms": ["NoSQL"],
                "Caching Systems": ["Redis", "Memcached", "KeyDB"],
            },
            "Document Databases": {
                "Document Stores": [
                    "MongoDB", "CouchDB", "Firestore", "Cosmos DB", "RavenDB",
                    "ArangoDB", "Couchbase", "DocumentDB", "OrientDB", "MarkLogic"
                ]
            },
            "Key-Value Databases": {
                "In-Memory KV": ["Redis", "Memcached", "KeyDB", "etcd", "Consul"],
                "Cloud KV": ["DynamoDB", "Riak", "Aerospike"],
            },
            "Graph Databases": {
                "Property Graph Databases": [
                    "Neo4j", "JanusGraph", "TigerGraph", "Dgraph", "Memgraph",
                    "Amazon Neptune", "RedisGraph", "Cayley", "OrientDB", "ArangoDB"
                ]
            },
            "Time-Series Databases": {
                "TSDBs": [
                    "InfluxDB", "TimescaleDB", "QuestDB", "OpenTSDB", "VictoriaMetrics",
                    "Graphite", "Kdb+", "RRDTool"
                ]
            },
            "In-Memory Databases": {
                "In-Memory Data Stores": [
                    "Redis", "Memcached", "Hazelcast", "Apache Ignite", "KeyDB",
                    "Aerospike", "Couchbase", "Tarantool", "VoltDB", "ScyllaDB"
                ]
            },
            "Search Engines": {
                "Search Platforms": [
                    "Elasticsearch", "OpenSearch", "Solr", "Algolia", "Meilisearch",
                    "Sphinx", "Typesense", "Xapian", "Whoosh", "Lucene"
                ]
            },
            "Vector Databases": {
                "Vector Stores": [
                    "Pinecone", "Weaviate", "Milvus", "Qdrant", "Chroma",
                    "FAISS", "pgvector", "LanceDB", "Redis Vector", "Vespa"
                ]
            },
            "Data Warehouses": {
                "Warehouse Platforms": [
                    "Snowflake", "BigQuery", "Redshift", "Databricks SQL", "Teradata",
                    "ClickHouse", "Azure Synapse", "Oracle Exadata", "Vertica", "IBM Netezza"
                ]
            },
        },
        "Cloud & DevOps": {
            "Cloud Providers": {
                "Public Cloud Providers": [
                    "AWS", "Azure", "Microsoft Azure", "Google Cloud", "Oracle Cloud", "IBM Cloud",
                    "DigitalOcean", "Linode"
                ],
                "Frontend Hosting": ["Vercel", "Netlify"],
            },
            "Containers": {
                "Container Runtimes": ["Docker", "Podman", "LXC", "LXD"],
                "Container Platforms": ["Kubernetes", "OpenShift", "Mesos", "Nomad", "Rancher", "K3s"],
            },
            "Container Orchestration": {
                "Orchestration Platforms": ["Kubernetes", "OpenShift", "Nomad", "Rancher", "K3s"],
            },
            "Infrastructure as Code": {
                "IaC Tools": [
                    "Terraform", "Pulumi", "Ansible", "Chef", "Salt",
                    "Docker Compose", "Vagrant", "Packer", "CloudFormation"
                ]
            },
            "CI/CD": {
                "CI Servers": [
                    "Jenkins", "GitLab CI", "CircleCI", "Travis CI", "AppVeyor",
                    "GitHub Actions", "Bitbucket Pipeline", "Drone CI", "Semaphore CI"
                ]
            },
            "Monitoring": {
                "Observability Tools": [
                    "Prometheus", "Grafana", "Datadog", "New Relic", "Dynatrace",
                    "CloudWatch", "OpenTelemetry", "ELK Stack", "Zabbix", "NdrScanner"
                ]
            },
            "Logging": {
                "Logging Tools": [
                    "ELK Stack", "Fluentd", "Logstash", "Graylog", "Sentry",
                    "Datadog", "New Relic", "Dynatrace", "CloudWatch", "OpenTelemetry"
                ]
            },
            "Secrets Management": {
                "Secret Managers": [
                    "Hashicorp Vault", "AWS Secrets Manager", "Azure Key Vault",
                    "Google Cloud Secret Manager", "Docker Secrets", "Kubernetes Secrets"
                ]
            },
            "Serverless": {
                "Cloud Functions": [
                    "AWS Lambda", "Azure Functions", "Google Cloud Functions",
                    "Oracle Cloud Functions", "IBM Cloud Functions", "DigitalOcean Functions"
                ]
            },
            "Configuration Management": {
                "Config Tools": [
                    "Ansible", "Chef", "Salt", "Pulumi", "Terraform",
                    "Docker Compose", "Vagrant", "Packer", "CloudFormation"
                ]
            },
        },
        "Platforms & Operating Systems": {
            "Linux": {
                "Linux Distributions": ["Ubuntu", "Debian", "CentOS", "Fedora", "RHEL", "OpenSUSE", "Arch"],
                "BSD Variants": ["FreeBSD", "NetBSD", "OpenBSD"],
            },
            "Windows": {
                "Windows Editions": ["Windows 10", "Windows 11", "Windows 7", "Windows 8", "Windows 9"],
                "Windows Server": ["Windows Server"],
            },
            "macOS": {
                "macOS Releases": [
                    "macOS", "macOS High Sierra", "macOS Mojave", "macOS Catalina",
                    "macOS Big Sur", "macOS Monterey", "macOS Ventura", "macOS Sonoma"
                ]
            },
            "Unix": {
                "Unix Variants": ["Unix", "BSD", "Solaris", "HP-UX", "AIX"],
            },
            "Android": {
                "Android Versions": ["Android", "Android 10", "Android 11", "Android 12", "Android 13", "Android 14"],
            },
            "iOS": {
                "iOS Versions": ["iOS", "iOS 10", "iOS 11", "iOS 12", "iOS 13", "iOS 14", "iOS 15"],
            },
            "Embedded Systems": {
                "Architectures": ["ARM", "x86"],
                "Shell & Scripting": ["Shell"],
            },
            "Testing": {
                "Testing Types": [
                    "Unit Testing", "Integration Testing", "End-to-End Testing", "API Testing",
                    "Performance Testing", "Regression Testing", "Acceptance Testing",
                    "Test Automation", "TDD", "BDD"
                ]
            },
            "Security": {
                "Security Domains": [
                    "Application Security", "Network Security", "Identity and Access Management",
                    "Cryptography", "Authentication", "Authorization", "Vulnerability Management",
                    "Penetration Testing", "Secure Coding", "Compliance"
                ]
            },
            "Data & AI": {
                "AI Subfields": [
                    "Machine Learning", "Deep Learning", "Natural Language Processing",
                    "Computer Vision", "LLMs"
                ],
                "Data Practices": [
                    "Data Analysis", "Data Engineering", "Data Visualization", "MLOps", "Statistics"
                ]
            },
            "Frontend": {
                "Markup & Styling": ["HTML", "CSS"],
                "UI/UX": ["Responsive Design", "Accessibility", "Performance Optimization"],
                "Client Architecture": ["State Management", "Component Architecture", "Routing", "Build Tools", "SSR/SSG"],
            },
            "Backend": {
                "API Styles": ["REST", "GraphQL", "API Design"],
                "Architectures": ["Microservices", "Event-Driven Architecture", "Scalability"],
                "Backend Concerns": ["Authentication", "Caching", "Message Queues", "Background Jobs"],
            },
            "Mobile": {
                "Cross-Platform": [
                    "Flutter", "React Native", "Kotlin Multiplatform", ".NET MAUI",
                    "Ionic", "Xamarin", "NativeScript", "Capacitor"
                ],
                "Native UI": ["SwiftUI", "Jetpack Compose"],
                "Mobile Concerns": ["Mobile UI", "Push Notifications", "Offline Sync"],
            },
            "Systems": {
                "Core Systems": [
                    "System Programming", "Memory Management", "Concurrency",
                    "Parallel Computing", "Distributed Systems", "Networking"
                ],
                "Language Runtime": ["Compilers", "Interpreters"],
                "Low-Level": ["Embedded Systems", "Operating System Concepts"],
            },
            "Tools": {
                "Version Control": ["Git"],
                "Package Managers": ["npm", "pip"],
                "Build Tools": ["Maven", "Gradle"],
                "Editors/IDEs": ["VS Code", "IntelliJ IDEA"],
                "API Tools": ["Postman"],
                "Project Management": ["Jira"],
                "Desktop Tools": ["Docker Desktop"],
            },
        },
        "Design": {
            "UI/UX Design": [
                "User Research", "Wireframing", "Prototyping", "Interaction Design",
                "Information Architecture", "Usability Testing", "Visual Design",
                "Design Systems", "Accessibility Design", "User Interface Design"
            ],
            "Product Design": [
                "Product Thinking", "Design Thinking", "Journey Mapping", "Persona Design",
                "User Flows", "Design Strategy", "Service Design", "Content Design",
                "Mobile Design", "Web Design"
            ],
        },
        "Game Development": {
            "Game Engines": [
                "Unity", "Unreal Engine", "Godot", "CryEngine", "GameMaker",
                "Construct", "Cocos2d-x", "Amazon Lumberyard", "Frostbite", "Source Engine"
            ],
            "3D Development": [
                "3D Modeling", "3D Rendering", "3D Animation", "Shading",
                "Texturing", "Rigging", "Lighting", "Physics Simulation",
                "Real-Time Rendering", "Scene Graphs"
            ],
            "Game Programming": [
                "Gameplay Programming", "Graphics Programming", "AI for Games",
                "Physics Engines", "Input Systems", "Animation Systems",
                "Level Design", "Multiplayer Systems", "Game Optimization", "VR/AR", "Game Design"
            ],
        },
    }

    add_tree(root, rules, branches)
    return root