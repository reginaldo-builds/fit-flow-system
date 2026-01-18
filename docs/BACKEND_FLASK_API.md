# 📚 Documentação do Backend - API Flask + PostgreSQL

## Sistema Multi-Tenant de Gestão de Fichas para Academias

Esta documentação detalha a implementação completa do backend usando **Flask**, **PostgreSQL**, **SQLAlchemy** e **JWT** para autenticação.

---

## 📁 Estrutura do Projeto

```
backend/
├── app/
│   ├── __init__.py              # Factory da aplicação Flask
│   ├── config.py                # Configurações (dev, prod, test)
│   ├── extensions.py            # Extensões Flask (SQLAlchemy, JWT, etc.)
│   │
│   ├── models/                  # Modelos SQLAlchemy
│   │   ├── __init__.py
│   │   ├── tenant.py            # Modelo de Tenant (Academia)
│   │   ├── user.py              # Modelo de Usuário
│   │   ├── student.py           # Modelo de Aluno
│   │   ├── request.py           # Modelo de Solicitação
│   │   ├── workout.py           # Modelo de Ficha de Treino
│   │   └── custom_field.py      # Campos personalizados
│   │
│   ├── api/                     # Blueprints da API
│   │   ├── __init__.py
│   │   ├── auth.py              # Autenticação (login, registro)
│   │   ├── tenants.py           # Gestão de tenants
│   │   ├── users.py             # Gestão de usuários (admin, personal)
│   │   ├── students.py          # Gestão de alunos
│   │   ├── requests.py          # Gestão de solicitações
│   │   ├── workouts.py          # Gestão de fichas
│   │   └── settings.py          # Configurações da academia
│   │
│   ├── services/                # Lógica de negócio
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── tenant_service.py
│   │   └── notification_service.py
│   │
│   ├── middleware/              # Middlewares
│   │   ├── __init__.py
│   │   └── tenant_middleware.py # Extração do tenant pelo slug
│   │
│   └── utils/                   # Utilitários
│       ├── __init__.py
│       ├── decorators.py        # Decoradores (roles, tenant)
│       └── helpers.py           # Funções auxiliares
│
├── migrations/                  # Migrations Alembic
│   ├── versions/
│   └── alembic.ini
│
├── tests/                       # Testes
│   ├── conftest.py
│   ├── test_auth.py
│   └── test_students.py
│
├── requirements.txt             # Dependências
├── Dockerfile                   # Container Docker
├── docker-compose.yml           # Orquestração
├── gunicorn.conf.py            # Configuração Gunicorn
├── nginx.conf                   # Configuração Nginx
└── run.py                       # Entry point
```

---

## 🗄️ Modelos do Banco de Dados

### Diagrama ER

```
┌─────────────────┐       ┌─────────────────┐
│     tenants     │       │      users      │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ tenant_id (FK)  │
│ slug (unique)   │       │ id (PK)         │
│ name            │       │ name            │
│ logo_url        │       │ email           │
│ whatsapp        │       │ password_hash   │
│ terms           │       │ whatsapp        │
│ privacy_policy  │       │ photo_url       │
│ created_at      │       │ created_at      │
└─────────────────┘       └─────────────────┘
                                  │
                                  ▼
                          ┌─────────────────┐
                          │   user_roles    │
                          ├─────────────────┤
                          │ id (PK)         │
                          │ user_id (FK)    │
                          │ role (enum)     │
                          └─────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    students     │       │    requests     │       │ custom_fields   │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ tenant_id (FK)  │       │ tenant_id (FK)  │       │ tenant_id (FK)  │
│ personal_id(FK) │       │ student_id (FK) │       │ personal_id(FK) │
│ name            │       │ personal_id(FK) │       │ field_name      │
│ email           │       │ status          │       │ field_type      │
│ whatsapp        │       │ notes           │       │ options (JSON)  │
│ birth_date      │       │ created_at      │       │ required        │
│ gender          │       │ updated_at      │       │ order           │
│ height          │       └─────────────────┘       └─────────────────┘
│ weight          │               │
│ photo_url       │               ▼
│ anamnesis(JSON) │       ┌─────────────────┐
│ accepted_terms  │       │    workouts     │
│ created_at      │       ├─────────────────┤
└─────────────────┘       │ id (PK)         │
                          │ tenant_id (FK)  │
                          │ request_id (FK) │
                          │ student_id (FK) │
                          │ file_url        │
                          │ access_token    │
                          │ created_at      │
                          │ expires_at      │
                          └─────────────────┘
```

### SQL de Criação das Tabelas

```sql
-- Enum para roles
CREATE TYPE app_role AS ENUM ('admin', 'personal', 'student');

-- Enum para status de solicitação
CREATE TYPE request_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- Enum para tipo de campo personalizado
CREATE TYPE field_type AS ENUM ('text', 'number', 'select', 'boolean', 'date');

-- Tabela de Tenants (Academias)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    whatsapp VARCHAR(20),
    terms TEXT,
    privacy_policy TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(20),
    photo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, email)
);

-- Tabela de Roles (separada para segurança)
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Tabela de Alunos
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    personal_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    whatsapp VARCHAR(20) NOT NULL,
    birth_date DATE,
    gender VARCHAR(20),
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    photo_url TEXT,
    anamnesis JSONB DEFAULT '{}',
    accepted_terms BOOLEAN DEFAULT FALSE,
    accepted_privacy BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Solicitações de Ficha
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    personal_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status request_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Fichas de Treino
CREATE TABLE workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    request_id UUID REFERENCES requests(id) ON DELETE SET NULL,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    personal_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_url TEXT,
    content TEXT,
    access_token VARCHAR(64) UNIQUE NOT NULL,
    download_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Campos Personalizados
CREATE TABLE custom_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    personal_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(255) NOT NULL,
    field_type field_type NOT NULL,
    options JSONB DEFAULT '[]',
    is_required BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_students_tenant ON students(tenant_id);
CREATE INDEX idx_students_personal ON students(personal_id);
CREATE INDEX idx_requests_tenant ON requests(tenant_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_workouts_token ON workouts(access_token);
CREATE INDEX idx_custom_fields_personal ON custom_fields(personal_id);

-- Função helper para verificar role (evita recursão em RLS)
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Função para obter tenant_id do usuário
CREATE OR REPLACE FUNCTION get_user_tenant(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT tenant_id FROM users WHERE id = _user_id
$$;
```

---

## 🐍 Modelos SQLAlchemy

### app/models/tenant.py

```python
from app.extensions import db
from datetime import datetime
import uuid

class Tenant(db.Model):
    __tablename__ = 'tenants'
    
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    logo_url = db.Column(db.Text)
    whatsapp = db.Column(db.String(20))
    terms = db.Column(db.Text)
    privacy_policy = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    users = db.relationship('User', backref='tenant', lazy='dynamic', cascade='all, delete-orphan')
    students = db.relationship('Student', backref='tenant', lazy='dynamic', cascade='all, delete-orphan')
    requests = db.relationship('Request', backref='tenant', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'slug': self.slug,
            'name': self.name,
            'logo_url': self.logo_url,
            'whatsapp': self.whatsapp,
            'terms': self.terms,
            'privacy_policy': self.privacy_policy,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def to_public_dict(self):
        """Dados públicos para página de login/formulário"""
        return {
            'id': str(self.id),
            'slug': self.slug,
            'name': self.name,
            'logo_url': self.logo_url
        }
```

### app/models/user.py

```python
from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import uuid

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('tenants.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    whatsapp = db.Column(db.String(20))
    photo_url = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    roles = db.relationship('UserRole', backref='user', lazy='joined', cascade='all, delete-orphan')
    students = db.relationship('Student', backref='personal', lazy='dynamic', foreign_keys='Student.personal_id')
    requests = db.relationship('Request', backref='personal', lazy='dynamic', foreign_keys='Request.personal_id')
    
    __table_args__ = (
        db.UniqueConstraint('tenant_id', 'email', name='uq_user_tenant_email'),
    )
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def has_role(self, role_name):
        return any(r.role == role_name for r in self.roles)
    
    def get_roles(self):
        return [r.role for r in self.roles]
    
    def to_dict(self, include_roles=True):
        data = {
            'id': str(self.id),
            'tenant_id': str(self.tenant_id),
            'name': self.name,
            'email': self.email,
            'whatsapp': self.whatsapp,
            'photo_url': self.photo_url,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if include_roles:
            data['roles'] = self.get_roles()
        return data


class UserRole(db.Model):
    __tablename__ = 'user_roles'
    
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin', 'personal', 'student'
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'role', name='uq_user_role'),
    )
```

### app/models/student.py

```python
from app.extensions import db
from datetime import datetime
import uuid

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('tenants.id'), nullable=False)
    personal_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255))
    whatsapp = db.Column(db.String(20), nullable=False)
    birth_date = db.Column(db.Date)
    gender = db.Column(db.String(20))
    height = db.Column(db.Numeric(5, 2))
    weight = db.Column(db.Numeric(5, 2))
    photo_url = db.Column(db.Text)
    anamnesis = db.Column(db.JSON, default=dict)
    accepted_terms = db.Column(db.Boolean, default=False)
    accepted_privacy = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    requests = db.relationship('Request', backref='student', lazy='dynamic', cascade='all, delete-orphan')
    workouts = db.relationship('Workout', backref='student', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self, include_anamnesis=False):
        data = {
            'id': str(self.id),
            'tenant_id': str(self.tenant_id),
            'personal_id': str(self.personal_id),
            'name': self.name,
            'email': self.email,
            'whatsapp': self.whatsapp,
            'birth_date': self.birth_date.isoformat() if self.birth_date else None,
            'gender': self.gender,
            'height': float(self.height) if self.height else None,
            'weight': float(self.weight) if self.weight else None,
            'photo_url': self.photo_url,
            'accepted_terms': self.accepted_terms,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if include_anamnesis:
            data['anamnesis'] = self.anamnesis
        return data
```

### app/models/request.py

```python
from app.extensions import db
from datetime import datetime
import uuid

class Request(db.Model):
    __tablename__ = 'requests'
    
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('tenants.id'), nullable=False)
    student_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('students.id'), nullable=False)
    personal_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, in_progress, completed, cancelled
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    workout = db.relationship('Workout', backref='request', uselist=False)
    
    def to_dict(self, include_relations=False):
        data = {
            'id': str(self.id),
            'tenant_id': str(self.tenant_id),
            'student_id': str(self.student_id),
            'personal_id': str(self.personal_id),
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        if include_relations:
            data['student'] = self.student.to_dict() if self.student else None
            data['personal'] = self.personal.to_dict(include_roles=False) if self.personal else None
        return data
```

### app/models/workout.py

```python
from app.extensions import db
from datetime import datetime, timedelta
import uuid
import secrets

class Workout(db.Model):
    __tablename__ = 'workouts'
    
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('tenants.id'), nullable=False)
    request_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('requests.id'))
    student_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('students.id'), nullable=False)
    personal_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    file_url = db.Column(db.Text)
    content = db.Column(db.Text)
    access_token = db.Column(db.String(64), unique=True, nullable=False)
    download_count = db.Column(db.Integer, default=0)
    expires_at = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.access_token:
            self.access_token = secrets.token_urlsafe(32)
        if not self.expires_at:
            self.expires_at = datetime.utcnow() + timedelta(days=30)
    
    def is_expired(self):
        return self.expires_at and datetime.utcnow() > self.expires_at
    
    def get_download_url(self, base_url):
        return f"{base_url}/api/workouts/download/{self.access_token}"
    
    def to_dict(self, include_download_url=False, base_url=None):
        data = {
            'id': str(self.id),
            'tenant_id': str(self.tenant_id),
            'request_id': str(self.request_id) if self.request_id else None,
            'student_id': str(self.student_id),
            'personal_id': str(self.personal_id),
            'title': self.title,
            'file_url': self.file_url,
            'download_count': self.download_count,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_expired': self.is_expired()
        }
        if include_download_url and base_url:
            data['download_url'] = self.get_download_url(base_url)
        return data
```

### app/models/custom_field.py

```python
from app.extensions import db
from datetime import datetime
import uuid

class CustomField(db.Model):
    __tablename__ = 'custom_fields'
    
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('tenants.id'), nullable=False)
    personal_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    field_name = db.Column(db.String(100), nullable=False)
    field_label = db.Column(db.String(255), nullable=False)
    field_type = db.Column(db.String(20), nullable=False)  # text, number, select, boolean, date
    options = db.Column(db.JSON, default=list)
    is_required = db.Column(db.Boolean, default=False)
    display_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'tenant_id': str(self.tenant_id),
            'personal_id': str(self.personal_id),
            'field_name': self.field_name,
            'field_label': self.field_label,
            'field_type': self.field_type,
            'options': self.options,
            'is_required': self.is_required,
            'display_order': self.display_order,
            'is_active': self.is_active
        }
```

---

## 🔧 Configuração da Aplicação

### app/config.py

```python
import os
from datetime import timedelta

class Config:
    """Configuração base"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/gym_system')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }
    
    # JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Upload
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', '/app/uploads')
    ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif'}
    
    # CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True


class ProductionConfig(Config):
    DEBUG = False
    
    # Em produção, força HTTPS
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:postgres@localhost:5432/gym_system_test'


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
```

### app/extensions.py

```python
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate

db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()
migrate = Migrate()
```

### app/__init__.py

```python
from flask import Flask, g
from app.config import config
from app.extensions import db, jwt, cors, migrate

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Inicializa extensões
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, origins=app.config['CORS_ORIGINS'], supports_credentials=True)
    migrate.init_app(app, db)
    
    # Registra middlewares
    from app.middleware.tenant_middleware import tenant_middleware
    app.before_request(tenant_middleware)
    
    # Registra blueprints
    from app.api import auth, tenants, users, students, requests, workouts, settings
    
    app.register_blueprint(auth.bp, url_prefix='/api/auth')
    app.register_blueprint(tenants.bp, url_prefix='/api/tenants')
    app.register_blueprint(users.bp, url_prefix='/api/users')
    app.register_blueprint(students.bp, url_prefix='/api/students')
    app.register_blueprint(requests.bp, url_prefix='/api/requests')
    app.register_blueprint(workouts.bp, url_prefix='/api/workouts')
    app.register_blueprint(settings.bp, url_prefix='/api/settings')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        return {'error': 'Resource not found'}, 404
    
    @app.errorhandler(500)
    def server_error(e):
        return {'error': 'Internal server error'}, 500
    
    return app
```

---

## 🔐 Middleware de Tenant

### app/middleware/tenant_middleware.py

```python
from flask import g, request
from app.models.tenant import Tenant

def tenant_middleware():
    """
    Extrai o tenant do header X-Tenant-Slug ou do path da URL.
    Define g.tenant para uso em toda a requisição.
    """
    g.tenant = None
    g.tenant_id = None
    
    # Rotas públicas que não precisam de tenant
    public_paths = ['/api/auth/login', '/api/tenants/public', '/api/workouts/download']
    if any(request.path.startswith(p) for p in public_paths):
        return
    
    # Tenta extrair do header primeiro
    tenant_slug = request.headers.get('X-Tenant-Slug')
    
    # Se não tiver no header, tenta extrair do path (para formulário público)
    if not tenant_slug and '/form/' in request.path:
        # Path format: /api/tenants/{slug}/form
        parts = request.path.split('/')
        if len(parts) >= 4:
            tenant_slug = parts[3]
    
    if tenant_slug:
        tenant = Tenant.query.filter_by(slug=tenant_slug, is_active=True).first()
        if tenant:
            g.tenant = tenant
            g.tenant_id = tenant.id
```

---

## 🔒 Decoradores de Autorização

### app/utils/decorators.py

```python
from functools import wraps
from flask import g, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.user import User

def require_tenant(f):
    """Requer que um tenant válido esteja definido"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not g.tenant:
            return jsonify({'error': 'Tenant not found or inactive'}), 404
        return f(*args, **kwargs)
    return decorated

def require_auth(f):
    """Requer autenticação JWT válida"""
    @wraps(f)
    def decorated(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'User not found or inactive'}), 401
        
        # Verifica se usuário pertence ao tenant atual
        if g.tenant and str(user.tenant_id) != str(g.tenant_id):
            return jsonify({'error': 'Access denied to this tenant'}), 403
        
        g.current_user = user
        return f(*args, **kwargs)
    return decorated

def require_role(*roles):
    """Requer que o usuário tenha uma das roles especificadas"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not hasattr(g, 'current_user'):
                return jsonify({'error': 'Authentication required'}), 401
            
            user_roles = g.current_user.get_roles()
            if not any(role in user_roles for role in roles):
                return jsonify({'error': 'Insufficient permissions'}), 403
            
            return f(*args, **kwargs)
        return decorated
    return decorator

def require_admin(f):
    """Atalho para require_role('admin')"""
    return require_role('admin')(f)

def require_personal(f):
    """Atalho para require_role('admin', 'personal')"""
    return require_role('admin', 'personal')(f)
```

---

## 🛣️ Endpoints da API

### app/api/auth.py - Autenticação

```python
from flask import Blueprint, request, jsonify, g
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.tenant import Tenant

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    """
    POST /api/auth/login
    
    Body:
    {
        "email": "admin@caxufit.com",
        "password": "admin123",
        "tenant_slug": "caxufit"
    }
    
    Response 200:
    {
        "access_token": "eyJ...",
        "refresh_token": "eyJ...",
        "user": {
            "id": "uuid",
            "name": "Admin",
            "email": "admin@caxufit.com",
            "roles": ["admin"]
        },
        "tenant": {
            "id": "uuid",
            "name": "CaxuFit Academia",
            "slug": "caxufit"
        }
    }
    """
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    tenant_slug = data.get('tenant_slug')
    
    if not all([email, password, tenant_slug]):
        return jsonify({'error': 'Email, password and tenant_slug are required'}), 400
    
    # Busca tenant
    tenant = Tenant.query.filter_by(slug=tenant_slug, is_active=True).first()
    if not tenant:
        return jsonify({'error': 'Academy not found'}), 404
    
    # Busca usuário
    user = User.query.filter_by(tenant_id=tenant.id, email=email, is_active=True).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Gera tokens
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            'tenant_id': str(tenant.id),
            'roles': user.get_roles()
        }
    )
    refresh_token = create_refresh_token(identity=str(user.id))
    
    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict(),
        'tenant': tenant.to_dict()
    })

@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """
    POST /api/auth/refresh
    
    Headers:
    Authorization: Bearer {refresh_token}
    
    Response 200:
    {
        "access_token": "eyJ..."
    }
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or not user.is_active:
        return jsonify({'error': 'User not found'}), 401
    
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            'tenant_id': str(user.tenant_id),
            'roles': user.get_roles()
        }
    )
    
    return jsonify({'access_token': access_token})

@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    GET /api/auth/me
    
    Headers:
    Authorization: Bearer {access_token}
    
    Response 200:
    {
        "user": {...},
        "tenant": {...}
    }
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'user': user.to_dict(),
        'tenant': user.tenant.to_dict()
    })
```

### app/api/tenants.py - Gestão de Tenants

```python
from flask import Blueprint, request, jsonify, g
from app.extensions import db
from app.models.tenant import Tenant
from app.models.user import User
from app.utils.decorators import require_tenant, require_auth, require_admin

bp = Blueprint('tenants', __name__)

@bp.route('/public/<slug>', methods=['GET'])
def get_tenant_public(slug):
    """
    GET /api/tenants/public/{slug}
    
    Retorna dados públicos do tenant para página de login/formulário.
    Não requer autenticação.
    
    Response 200:
    {
        "id": "uuid",
        "slug": "caxufit",
        "name": "CaxuFit Academia",
        "logo_url": "https://..."
    }
    """
    tenant = Tenant.query.filter_by(slug=slug, is_active=True).first()
    if not tenant:
        return jsonify({'error': 'Academy not found'}), 404
    
    return jsonify(tenant.to_public_dict())

@bp.route('/current', methods=['GET'])
@require_tenant
@require_auth
def get_current_tenant():
    """
    GET /api/tenants/current
    
    Headers:
    Authorization: Bearer {token}
    X-Tenant-Slug: caxufit
    
    Response 200: Dados completos do tenant atual
    """
    return jsonify(g.tenant.to_dict())

@bp.route('/current', methods=['PUT'])
@require_tenant
@require_auth
@require_admin
def update_current_tenant():
    """
    PUT /api/tenants/current
    
    Headers:
    Authorization: Bearer {token}
    X-Tenant-Slug: caxufit
    
    Body:
    {
        "name": "Novo Nome",
        "logo_url": "https://...",
        "whatsapp": "5588999999999",
        "terms": "Termos de uso...",
        "privacy_policy": "Política de privacidade..."
    }
    
    Response 200: Tenant atualizado
    """
    data = request.get_json()
    tenant = g.tenant
    
    allowed_fields = ['name', 'logo_url', 'whatsapp', 'terms', 'privacy_policy']
    for field in allowed_fields:
        if field in data:
            setattr(tenant, field, data[field])
    
    db.session.commit()
    return jsonify(tenant.to_dict())

@bp.route('/<slug>/personals', methods=['GET'])
def get_tenant_personals(slug):
    """
    GET /api/tenants/{slug}/personals
    
    Lista pública de personais para formulário de aluno.
    Não requer autenticação.
    
    Response 200:
    {
        "personals": [
            {
                "id": "uuid",
                "name": "João Personal",
                "photo_url": "https://..."
            }
        ]
    }
    """
    tenant = Tenant.query.filter_by(slug=slug, is_active=True).first()
    if not tenant:
        return jsonify({'error': 'Academy not found'}), 404
    
    from app.models.user import User, UserRole
    
    personals = User.query.join(UserRole).filter(
        User.tenant_id == tenant.id,
        User.is_active == True,
        UserRole.role == 'personal'
    ).all()
    
    return jsonify({
        'personals': [
            {
                'id': str(p.id),
                'name': p.name,
                'photo_url': p.photo_url
            } for p in personals
        ]
    })
```

### app/api/users.py - Gestão de Usuários (Staff)

```python
from flask import Blueprint, request, jsonify, g
from app.extensions import db
from app.models.user import User, UserRole
from app.utils.decorators import require_tenant, require_auth, require_admin

bp = Blueprint('users', __name__)

@bp.route('/', methods=['GET'])
@require_tenant
@require_auth
@require_admin
def list_users():
    """
    GET /api/users
    
    Lista todos os usuários do tenant (admin e personais).
    
    Query params:
    - role: Filtrar por role (admin, personal)
    - search: Buscar por nome ou email
    
    Response 200:
    {
        "users": [...]
    }
    """
    query = User.query.filter_by(tenant_id=g.tenant_id, is_active=True)
    
    role = request.args.get('role')
    if role:
        query = query.join(UserRole).filter(UserRole.role == role)
    
    search = request.args.get('search')
    if search:
        query = query.filter(
            db.or_(
                User.name.ilike(f'%{search}%'),
                User.email.ilike(f'%{search}%')
            )
        )
    
    users = query.all()
    return jsonify({'users': [u.to_dict() for u in users]})

@bp.route('/', methods=['POST'])
@require_tenant
@require_auth
@require_admin
def create_user():
    """
    POST /api/users
    
    Cria novo usuário (personal).
    
    Body:
    {
        "name": "Maria Personal",
        "email": "maria@caxufit.com",
        "password": "senha123",
        "whatsapp": "5588999999999",
        "role": "personal"
    }
    
    Response 201: Usuário criado
    """
    data = request.get_json()
    
    required = ['name', 'email', 'password', 'role']
    if not all(data.get(f) for f in required):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Verifica se email já existe no tenant
    existing = User.query.filter_by(
        tenant_id=g.tenant_id,
        email=data['email']
    ).first()
    if existing:
        return jsonify({'error': 'Email already registered'}), 409
    
    # Cria usuário
    user = User(
        tenant_id=g.tenant_id,
        name=data['name'],
        email=data['email'],
        whatsapp=data.get('whatsapp'),
        photo_url=data.get('photo_url')
    )
    user.set_password(data['password'])
    
    # Adiciona role
    role = UserRole(role=data['role'])
    user.roles.append(role)
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify(user.to_dict()), 201

@bp.route('/<uuid:user_id>', methods=['GET'])
@require_tenant
@require_auth
@require_admin
def get_user(user_id):
    """
    GET /api/users/{user_id}
    
    Response 200: Dados do usuário
    """
    user = User.query.filter_by(
        id=user_id,
        tenant_id=g.tenant_id
    ).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict())

@bp.route('/<uuid:user_id>', methods=['PUT'])
@require_tenant
@require_auth
@require_admin
def update_user(user_id):
    """
    PUT /api/users/{user_id}
    
    Body:
    {
        "name": "Novo Nome",
        "whatsapp": "5588999999999",
        "photo_url": "https://..."
    }
    
    Response 200: Usuário atualizado
    """
    user = User.query.filter_by(
        id=user_id,
        tenant_id=g.tenant_id
    ).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    allowed_fields = ['name', 'whatsapp', 'photo_url']
    for field in allowed_fields:
        if field in data:
            setattr(user, field, data[field])
    
    # Atualiza senha se fornecida
    if data.get('password'):
        user.set_password(data['password'])
    
    db.session.commit()
    return jsonify(user.to_dict())

@bp.route('/<uuid:user_id>', methods=['DELETE'])
@require_tenant
@require_auth
@require_admin
def delete_user(user_id):
    """
    DELETE /api/users/{user_id}
    
    Soft delete do usuário.
    
    Response 204: Sucesso
    """
    user = User.query.filter_by(
        id=user_id,
        tenant_id=g.tenant_id
    ).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Não permite excluir a si mesmo
    if str(user.id) == str(g.current_user.id):
        return jsonify({'error': 'Cannot delete yourself'}), 400
    
    user.is_active = False
    db.session.commit()
    
    return '', 204
```

### app/api/students.py - Gestão de Alunos

```python
from flask import Blueprint, request, jsonify, g
from app.extensions import db
from app.models.student import Student
from app.models.request import Request
from app.utils.decorators import require_tenant, require_auth, require_personal

bp = Blueprint('students', __name__)

@bp.route('/', methods=['GET'])
@require_tenant
@require_auth
@require_personal
def list_students():
    """
    GET /api/students
    
    Lista alunos. Admin vê todos, Personal vê apenas os seus.
    
    Query params:
    - search: Buscar por nome, email ou whatsapp
    - personal_id: Filtrar por personal (apenas admin)
    
    Response 200:
    {
        "students": [...],
        "total": 10
    }
    """
    query = Student.query.filter_by(tenant_id=g.tenant_id, is_active=True)
    
    # Personal só vê seus alunos
    if not g.current_user.has_role('admin'):
        query = query.filter_by(personal_id=g.current_user.id)
    else:
        personal_id = request.args.get('personal_id')
        if personal_id:
            query = query.filter_by(personal_id=personal_id)
    
    search = request.args.get('search')
    if search:
        query = query.filter(
            db.or_(
                Student.name.ilike(f'%{search}%'),
                Student.email.ilike(f'%{search}%'),
                Student.whatsapp.ilike(f'%{search}%')
            )
        )
    
    students = query.order_by(Student.name).all()
    
    return jsonify({
        'students': [s.to_dict() for s in students],
        'total': len(students)
    })

@bp.route('/', methods=['POST'])
@require_tenant
@require_auth
@require_personal
def create_student():
    """
    POST /api/students
    
    Cria novo aluno manualmente.
    
    Body:
    {
        "name": "Carlos Aluno",
        "email": "carlos@email.com",
        "whatsapp": "5588999999999",
        "birth_date": "1990-05-15",
        "gender": "male",
        "height": 175,
        "weight": 80,
        "anamnesis": {...}
    }
    
    Response 201: Aluno criado
    """
    data = request.get_json()
    
    if not data.get('name') or not data.get('whatsapp'):
        return jsonify({'error': 'Name and WhatsApp are required'}), 400
    
    student = Student(
        tenant_id=g.tenant_id,
        personal_id=g.current_user.id,
        name=data['name'],
        email=data.get('email'),
        whatsapp=data['whatsapp'],
        birth_date=data.get('birth_date'),
        gender=data.get('gender'),
        height=data.get('height'),
        weight=data.get('weight'),
        photo_url=data.get('photo_url'),
        anamnesis=data.get('anamnesis', {}),
        accepted_terms=data.get('accepted_terms', False),
        accepted_privacy=data.get('accepted_privacy', False)
    )
    
    db.session.add(student)
    db.session.commit()
    
    return jsonify(student.to_dict(include_anamnesis=True)), 201

@bp.route('/public', methods=['POST'])
@require_tenant
def create_student_public():
    """
    POST /api/students/public
    
    Cria aluno via formulário público (não requer auth).
    O tenant é identificado pelo header X-Tenant-Slug.
    
    Body:
    {
        "personal_id": "uuid",
        "name": "Carlos Aluno",
        "whatsapp": "5588999999999",
        "birth_date": "1990-05-15",
        "gender": "male",
        "height": 175,
        "weight": 80,
        "anamnesis": {...},
        "accepted_terms": true,
        "accepted_privacy": true
    }
    
    Response 201:
    {
        "student": {...},
        "whatsapp_url": "https://wa.me/5588999999999?text=..."
    }
    """
    data = request.get_json()
    
    required = ['personal_id', 'name', 'whatsapp', 'accepted_terms', 'accepted_privacy']
    if not all(data.get(f) for f in required):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if not data['accepted_terms'] or not data['accepted_privacy']:
        return jsonify({'error': 'Must accept terms and privacy policy'}), 400
    
    # Verifica se personal existe e pertence ao tenant
    from app.models.user import User
    personal = User.query.filter_by(
        id=data['personal_id'],
        tenant_id=g.tenant_id,
        is_active=True
    ).first()
    
    if not personal:
        return jsonify({'error': 'Personal trainer not found'}), 404
    
    student = Student(
        tenant_id=g.tenant_id,
        personal_id=personal.id,
        name=data['name'],
        email=data.get('email'),
        whatsapp=data['whatsapp'],
        birth_date=data.get('birth_date'),
        gender=data.get('gender'),
        height=data.get('height'),
        weight=data.get('weight'),
        photo_url=data.get('photo_url'),
        anamnesis=data.get('anamnesis', {}),
        accepted_terms=True,
        accepted_privacy=True
    )
    
    db.session.add(student)
    
    # Cria solicitação automaticamente
    req = Request(
        tenant_id=g.tenant_id,
        student_id=student.id,
        personal_id=personal.id,
        status='pending'
    )
    db.session.add(req)
    
    db.session.commit()
    
    # Monta URL do WhatsApp
    message = f"Olá {personal.name}! Sou {student.name} e acabei de preencher o formulário de avaliação. Aguardo minha ficha de treino!"
    import urllib.parse
    whatsapp_url = f"https://wa.me/{personal.whatsapp}?text={urllib.parse.quote(message)}"
    
    return jsonify({
        'student': student.to_dict(),
        'request_id': str(req.id),
        'whatsapp_url': whatsapp_url
    }), 201

@bp.route('/<uuid:student_id>', methods=['GET'])
@require_tenant
@require_auth
@require_personal
def get_student(student_id):
    """
    GET /api/students/{student_id}
    
    Response 200: Dados completos do aluno incluindo anamnese
    """
    query = Student.query.filter_by(
        id=student_id,
        tenant_id=g.tenant_id
    )
    
    # Personal só vê seus alunos
    if not g.current_user.has_role('admin'):
        query = query.filter_by(personal_id=g.current_user.id)
    
    student = query.first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    return jsonify(student.to_dict(include_anamnesis=True))

@bp.route('/<uuid:student_id>', methods=['PUT'])
@require_tenant
@require_auth
@require_personal
def update_student(student_id):
    """
    PUT /api/students/{student_id}
    
    Atualiza dados do aluno.
    
    Response 200: Aluno atualizado
    """
    query = Student.query.filter_by(
        id=student_id,
        tenant_id=g.tenant_id
    )
    
    if not g.current_user.has_role('admin'):
        query = query.filter_by(personal_id=g.current_user.id)
    
    student = query.first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    data = request.get_json()
    
    allowed_fields = ['name', 'email', 'whatsapp', 'birth_date', 'gender', 
                      'height', 'weight', 'photo_url', 'anamnesis']
    for field in allowed_fields:
        if field in data:
            setattr(student, field, data[field])
    
    db.session.commit()
    return jsonify(student.to_dict(include_anamnesis=True))

@bp.route('/<uuid:student_id>', methods=['DELETE'])
@require_tenant
@require_auth
@require_admin
def delete_student(student_id):
    """
    DELETE /api/students/{student_id}
    
    Soft delete do aluno (apenas admin).
    
    Response 204: Sucesso
    """
    student = Student.query.filter_by(
        id=student_id,
        tenant_id=g.tenant_id
    ).first()
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    student.is_active = False
    db.session.commit()
    
    return '', 204

@bp.route('/<uuid:student_id>/workouts', methods=['GET'])
@require_tenant
@require_auth
@require_personal
def get_student_workouts(student_id):
    """
    GET /api/students/{student_id}/workouts
    
    Lista fichas de treino do aluno.
    
    Response 200:
    {
        "workouts": [...]
    }
    """
    from app.models.workout import Workout
    
    query = Student.query.filter_by(
        id=student_id,
        tenant_id=g.tenant_id
    )
    
    if not g.current_user.has_role('admin'):
        query = query.filter_by(personal_id=g.current_user.id)
    
    student = query.first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    workouts = Workout.query.filter_by(
        student_id=student_id,
        tenant_id=g.tenant_id
    ).order_by(Workout.created_at.desc()).all()
    
    base_url = request.host_url.rstrip('/')
    return jsonify({
        'workouts': [w.to_dict(include_download_url=True, base_url=base_url) for w in workouts]
    })
```

### app/api/requests.py - Gestão de Solicitações

```python
from flask import Blueprint, request, jsonify, g
from app.extensions import db
from app.models.request import Request
from app.utils.decorators import require_tenant, require_auth, require_personal

bp = Blueprint('requests', __name__)

@bp.route('/', methods=['GET'])
@require_tenant
@require_auth
@require_personal
def list_requests():
    """
    GET /api/requests
    
    Lista solicitações. Admin vê todas, Personal vê apenas as suas.
    
    Query params:
    - status: pending, in_progress, completed, cancelled
    - personal_id: Filtrar por personal (apenas admin)
    
    Response 200:
    {
        "requests": [...],
        "pending_count": 5
    }
    """
    query = Request.query.filter_by(tenant_id=g.tenant_id)
    
    # Personal só vê suas solicitações
    if not g.current_user.has_role('admin'):
        query = query.filter_by(personal_id=g.current_user.id)
    else:
        personal_id = request.args.get('personal_id')
        if personal_id:
            query = query.filter_by(personal_id=personal_id)
    
    status = request.args.get('status')
    if status:
        query = query.filter_by(status=status)
    
    requests_list = query.order_by(Request.created_at.desc()).all()
    pending_count = query.filter_by(status='pending').count()
    
    return jsonify({
        'requests': [r.to_dict(include_relations=True) for r in requests_list],
        'pending_count': pending_count
    })

@bp.route('/<uuid:request_id>', methods=['GET'])
@require_tenant
@require_auth
@require_personal
def get_request(request_id):
    """
    GET /api/requests/{request_id}
    
    Response 200: Dados da solicitação com aluno e personal
    """
    query = Request.query.filter_by(
        id=request_id,
        tenant_id=g.tenant_id
    )
    
    if not g.current_user.has_role('admin'):
        query = query.filter_by(personal_id=g.current_user.id)
    
    req = query.first()
    if not req:
        return jsonify({'error': 'Request not found'}), 404
    
    return jsonify(req.to_dict(include_relations=True))

@bp.route('/<uuid:request_id>/status', methods=['PUT'])
@require_tenant
@require_auth
@require_personal
def update_request_status(request_id):
    """
    PUT /api/requests/{request_id}/status
    
    Atualiza status da solicitação.
    
    Body:
    {
        "status": "in_progress",
        "notes": "Começando a montar a ficha"
    }
    
    Response 200: Solicitação atualizada
    """
    query = Request.query.filter_by(
        id=request_id,
        tenant_id=g.tenant_id
    )
    
    if not g.current_user.has_role('admin'):
        query = query.filter_by(personal_id=g.current_user.id)
    
    req = query.first()
    if not req:
        return jsonify({'error': 'Request not found'}), 404
    
    data = request.get_json()
    
    valid_statuses = ['pending', 'in_progress', 'completed', 'cancelled']
    if data.get('status') and data['status'] not in valid_statuses:
        return jsonify({'error': 'Invalid status'}), 400
    
    if data.get('status'):
        req.status = data['status']
    if data.get('notes'):
        req.notes = data['notes']
    
    db.session.commit()
    return jsonify(req.to_dict(include_relations=True))

@bp.route('/pending-count', methods=['GET'])
@require_tenant
@require_auth
@require_personal
def get_pending_count():
    """
    GET /api/requests/pending-count
    
    Retorna contagem de solicitações pendentes (para badge).
    
    Response 200:
    {
        "count": 5
    }
    """
    query = Request.query.filter_by(
        tenant_id=g.tenant_id,
        status='pending'
    )
    
    if not g.current_user.has_role('admin'):
        query = query.filter_by(personal_id=g.current_user.id)
    
    count = query.count()
    return jsonify({'count': count})
```

### app/api/workouts.py - Gestão de Fichas

```python
from flask import Blueprint, request, jsonify, g, send_file
from app.extensions import db
from app.models.workout import Workout
from app.models.request import Request
from app.utils.decorators import require_tenant, require_auth, require_personal
import urllib.parse

bp = Blueprint('workouts', __name__)

@bp.route('/', methods=['POST'])
@require_tenant
@require_auth
@require_personal
def create_workout():
    """
    POST /api/workouts
    
    Cria nova ficha de treino.
    
    Body:
    {
        "request_id": "uuid" (opcional),
        "student_id": "uuid",
        "title": "Treino A - Peito e Tríceps",
        "file_url": "https://..." (opcional),
        "content": "Texto da ficha" (opcional)
    }
    
    Response 201:
    {
        "workout": {...},
        "download_url": "https://...",
        "whatsapp_url": "https://wa.me/..."
    }
    """
    data = request.get_json()
    
    if not data.get('student_id') or not data.get('title'):
        return jsonify({'error': 'student_id and title are required'}), 400
    
    # Verifica se aluno pertence ao personal
    from app.models.student import Student
    student = Student.query.filter_by(
        id=data['student_id'],
        tenant_id=g.tenant_id
    ).first()
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    if not g.current_user.has_role('admin') and str(student.personal_id) != str(g.current_user.id):
        return jsonify({'error': 'Access denied'}), 403
    
    workout = Workout(
        tenant_id=g.tenant_id,
        request_id=data.get('request_id'),
        student_id=data['student_id'],
        personal_id=g.current_user.id,
        title=data['title'],
        file_url=data.get('file_url'),
        content=data.get('content')
    )
    
    db.session.add(workout)
    
    # Atualiza status da solicitação se fornecida
    if data.get('request_id'):
        req = Request.query.get(data['request_id'])
        if req:
            req.status = 'completed'
    
    db.session.commit()
    
    # Monta URLs
    base_url = request.host_url.rstrip('/')
    download_url = workout.get_download_url(base_url)
    
    message = f"Olá {student.name}! Sua ficha de treino '{workout.title}' está pronta! Acesse: {download_url}"
    whatsapp_url = f"https://wa.me/{student.whatsapp}?text={urllib.parse.quote(message)}"
    
    return jsonify({
        'workout': workout.to_dict(include_download_url=True, base_url=base_url),
        'download_url': download_url,
        'whatsapp_url': whatsapp_url
    }), 201

@bp.route('/download/<token>', methods=['GET'])
def download_workout(token):
    """
    GET /api/workouts/download/{token}
    
    Download público da ficha via token.
    Não requer autenticação.
    
    Response 200: Arquivo ou redirect para file_url
    Response 404: Token inválido ou expirado
    """
    workout = Workout.query.filter_by(access_token=token).first()
    
    if not workout:
        return jsonify({'error': 'Workout not found'}), 404
    
    if workout.is_expired():
        return jsonify({'error': 'Link expired'}), 410
    
    # Incrementa contador
    workout.download_count += 1
    db.session.commit()
    
    if workout.file_url:
        return jsonify({
            'title': workout.title,
            'file_url': workout.file_url,
            'download_count': workout.download_count
        })
    elif workout.content:
        return jsonify({
            'title': workout.title,
            'content': workout.content,
            'download_count': workout.download_count
        })
    else:
        return jsonify({'error': 'No content available'}), 404

@bp.route('/', methods=['GET'])
@require_tenant
@require_auth
@require_personal
def list_workouts():
    """
    GET /api/workouts
    
    Lista fichas. Admin vê todas, Personal vê apenas as suas.
    
    Query params:
    - student_id: Filtrar por aluno
    
    Response 200:
    {
        "workouts": [...]
    }
    """
    query = Workout.query.filter_by(tenant_id=g.tenant_id)
    
    if not g.current_user.has_role('admin'):
        query = query.filter_by(personal_id=g.current_user.id)
    
    student_id = request.args.get('student_id')
    if student_id:
        query = query.filter_by(student_id=student_id)
    
    workouts = query.order_by(Workout.created_at.desc()).all()
    
    base_url = request.host_url.rstrip('/')
    return jsonify({
        'workouts': [w.to_dict(include_download_url=True, base_url=base_url) for w in workouts]
    })
```

### app/api/settings.py - Campos Personalizados

```python
from flask import Blueprint, request, jsonify, g
from app.extensions import db
from app.models.custom_field import CustomField
from app.utils.decorators import require_tenant, require_auth, require_personal

bp = Blueprint('settings', __name__)

@bp.route('/custom-fields', methods=['GET'])
@require_tenant
@require_auth
@require_personal
def list_custom_fields():
    """
    GET /api/settings/custom-fields
    
    Lista campos personalizados do personal.
    
    Response 200:
    {
        "fields": [...]
    }
    """
    fields = CustomField.query.filter_by(
        tenant_id=g.tenant_id,
        personal_id=g.current_user.id,
        is_active=True
    ).order_by(CustomField.display_order).all()
    
    return jsonify({'fields': [f.to_dict() for f in fields]})

@bp.route('/custom-fields', methods=['POST'])
@require_tenant
@require_auth
@require_personal
def create_custom_field():
    """
    POST /api/settings/custom-fields
    
    Cria campo personalizado.
    
    Body:
    {
        "field_name": "objetivo",
        "field_label": "Qual seu objetivo principal?",
        "field_type": "select",
        "options": ["Emagrecimento", "Hipertrofia", "Condicionamento"],
        "is_required": true
    }
    
    Response 201: Campo criado
    """
    data = request.get_json()
    
    required = ['field_name', 'field_label', 'field_type']
    if not all(data.get(f) for f in required):
        return jsonify({'error': 'Missing required fields'}), 400
    
    valid_types = ['text', 'number', 'select', 'boolean', 'date']
    if data['field_type'] not in valid_types:
        return jsonify({'error': 'Invalid field type'}), 400
    
    # Define ordem como próximo número
    max_order = db.session.query(db.func.max(CustomField.display_order)).filter_by(
        personal_id=g.current_user.id
    ).scalar() or 0
    
    field = CustomField(
        tenant_id=g.tenant_id,
        personal_id=g.current_user.id,
        field_name=data['field_name'],
        field_label=data['field_label'],
        field_type=data['field_type'],
        options=data.get('options', []),
        is_required=data.get('is_required', False),
        display_order=max_order + 1
    )
    
    db.session.add(field)
    db.session.commit()
    
    return jsonify(field.to_dict()), 201

@bp.route('/custom-fields/<uuid:field_id>', methods=['PUT'])
@require_tenant
@require_auth
@require_personal
def update_custom_field(field_id):
    """
    PUT /api/settings/custom-fields/{field_id}
    
    Atualiza campo personalizado.
    
    Response 200: Campo atualizado
    """
    field = CustomField.query.filter_by(
        id=field_id,
        tenant_id=g.tenant_id,
        personal_id=g.current_user.id
    ).first()
    
    if not field:
        return jsonify({'error': 'Field not found'}), 404
    
    data = request.get_json()
    
    allowed = ['field_label', 'options', 'is_required', 'display_order']
    for key in allowed:
        if key in data:
            setattr(field, key, data[key])
    
    db.session.commit()
    return jsonify(field.to_dict())

@bp.route('/custom-fields/<uuid:field_id>', methods=['DELETE'])
@require_tenant
@require_auth
@require_personal
def delete_custom_field(field_id):
    """
    DELETE /api/settings/custom-fields/{field_id}
    
    Remove campo personalizado (soft delete).
    
    Response 204: Sucesso
    """
    field = CustomField.query.filter_by(
        id=field_id,
        tenant_id=g.tenant_id,
        personal_id=g.current_user.id
    ).first()
    
    if not field:
        return jsonify({'error': 'Field not found'}), 404
    
    field.is_active = False
    db.session.commit()
    
    return '', 204

@bp.route('/custom-fields/public/<uuid:personal_id>', methods=['GET'])
@require_tenant
def get_public_custom_fields(personal_id):
    """
    GET /api/settings/custom-fields/public/{personal_id}
    
    Lista campos personalizados para formulário público.
    Não requer autenticação.
    
    Response 200:
    {
        "fields": [...]
    }
    """
    fields = CustomField.query.filter_by(
        tenant_id=g.tenant_id,
        personal_id=personal_id,
        is_active=True
    ).order_by(CustomField.display_order).all()
    
    return jsonify({'fields': [f.to_dict() for f in fields]})
```

---

## 🚀 Deploy com Docker

### requirements.txt

```txt
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
Flask-JWT-Extended==4.6.0
Flask-Cors==4.0.0
Flask-Migrate==4.0.5
psycopg2-binary==2.9.9
gunicorn==21.2.0
python-dotenv==1.0.0
Werkzeug==3.0.1
```

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Dependências do sistema
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copia requirements e instala dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia código
COPY . .

# Variáveis de ambiente
ENV FLASK_APP=run.py
ENV FLASK_ENV=production

# Porta
EXPOSE 5000

# Comando de inicialização
CMD ["gunicorn", "--config", "gunicorn.conf.py", "run:app"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: gym_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: gym_system
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  api:
    build: .
    container_name: gym_api
    environment:
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD:-postgres}@db:5432/gym_system
      - SECRET_KEY=${SECRET_KEY:-change-me-in-production}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY:-jwt-change-me}
      - FLASK_ENV=${FLASK_ENV:-production}
      - CORS_ORIGINS=${CORS_ORIGINS:-*}
    ports:
      - "5000:5000"
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./uploads:/app/uploads
    command: >
      sh -c "flask db upgrade && gunicorn --config gunicorn.conf.py run:app"

  nginx:
    image: nginx:alpine
    container_name: gym_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - api

volumes:
  postgres_data:
```

### gunicorn.conf.py

```python
import multiprocessing

# Bind
bind = "0.0.0.0:5000"

# Workers
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Process naming
proc_name = "gym_api"

# Server mechanics
daemon = False
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

# SSL (se necessário)
# keyfile = "/path/to/keyfile"
# certfile = "/path/to/certfile"
```

### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logs
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip
    gzip on;
    gzip_types text/plain application/json application/javascript text/css;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    upstream api {
        server api:5000;
    }

    server {
        listen 80;
        server_name api.seudominio.com;

        # Redirect to HTTPS (descomente em produção)
        # return 301 https://$server_name$request_uri;

        location / {
            limit_req zone=api burst=20 nodelay;
            
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Health check
        location /health {
            return 200 'OK';
            add_header Content-Type text/plain;
        }
    }

    # HTTPS server (descomente em produção)
    # server {
    #     listen 443 ssl http2;
    #     server_name api.seudominio.com;
    #
    #     ssl_certificate /etc/nginx/ssl/cert.pem;
    #     ssl_certificate_key /etc/nginx/ssl/key.pem;
    #     ssl_protocols TLSv1.2 TLSv1.3;
    #
    #     location / {
    #         # ... mesma configuração acima
    #     }
    # }
}
```

### run.py

```python
import os
from app import create_app

config_name = os.environ.get('FLASK_ENV', 'development')
app = create_app(config_name)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=(config_name == 'development'))
```

---

## 📋 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL=postgresql://postgres:sua_senha@localhost:5432/gym_system
DB_PASSWORD=sua_senha_postgres

# Segurança
SECRET_KEY=sua-chave-secreta-super-segura-aqui
JWT_SECRET_KEY=sua-chave-jwt-super-segura-aqui

# Flask
FLASK_ENV=production
FLASK_APP=run.py

# CORS (URLs do frontend separadas por vírgula)
CORS_ORIGINS=https://seudominio.com,https://www.seudominio.com

# Upload
UPLOAD_FOLDER=/app/uploads
```

---

## 🔄 Migrations com Alembic

```bash
# Inicializar migrations (primeira vez)
flask db init

# Criar migration
flask db migrate -m "Initial migration"

# Aplicar migrations
flask db upgrade

# Reverter última migration
flask db downgrade
```

---

## 🧪 Testes

### tests/conftest.py

```python
import pytest
from app import create_app
from app.extensions import db

@pytest.fixture
def app():
    app = create_app('testing')
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_headers(client):
    # Cria tenant e usuário de teste
    from app.models.tenant import Tenant
    from app.models.user import User, UserRole
    
    tenant = Tenant(slug='test', name='Test Gym')
    db.session.add(tenant)
    db.session.flush()
    
    user = User(
        tenant_id=tenant.id,
        name='Test Admin',
        email='admin@test.com'
    )
    user.set_password('test123')
    user.roles.append(UserRole(role='admin'))
    db.session.add(user)
    db.session.commit()
    
    # Login
    response = client.post('/api/auth/login', json={
        'email': 'admin@test.com',
        'password': 'test123',
        'tenant_slug': 'test'
    })
    
    token = response.get_json()['access_token']
    
    return {
        'Authorization': f'Bearer {token}',
        'X-Tenant-Slug': 'test'
    }
```

### tests/test_auth.py

```python
def test_login_success(client):
    # Primeiro cria tenant e usuário
    from app.models.tenant import Tenant
    from app.models.user import User, UserRole
    from app.extensions import db
    
    with client.application.app_context():
        tenant = Tenant(slug='test', name='Test')
        db.session.add(tenant)
        db.session.flush()
        
        user = User(tenant_id=tenant.id, name='Test', email='test@test.com')
        user.set_password('test123')
        user.roles.append(UserRole(role='admin'))
        db.session.add(user)
        db.session.commit()
    
    response = client.post('/api/auth/login', json={
        'email': 'test@test.com',
        'password': 'test123',
        'tenant_slug': 'test'
    })
    
    assert response.status_code == 200
    assert 'access_token' in response.get_json()

def test_login_invalid_password(client):
    response = client.post('/api/auth/login', json={
        'email': 'test@test.com',
        'password': 'wrong',
        'tenant_slug': 'test'
    })
    
    assert response.status_code == 401
```

---

## 📖 Resumo dos Endpoints

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/login` | Login | ❌ |
| POST | `/api/auth/refresh` | Refresh token | ✅ |
| GET | `/api/auth/me` | Usuário atual | ✅ |
| GET | `/api/tenants/public/{slug}` | Dados públicos do tenant | ❌ |
| GET | `/api/tenants/current` | Tenant atual | ✅ |
| PUT | `/api/tenants/current` | Atualizar tenant | Admin |
| GET | `/api/tenants/{slug}/personals` | Lista personais públicos | ❌ |
| GET | `/api/users` | Listar usuários | Admin |
| POST | `/api/users` | Criar usuário | Admin |
| GET | `/api/users/{id}` | Obter usuário | Admin |
| PUT | `/api/users/{id}` | Atualizar usuário | Admin |
| DELETE | `/api/users/{id}` | Remover usuário | Admin |
| GET | `/api/students` | Listar alunos | Personal |
| POST | `/api/students` | Criar aluno | Personal |
| POST | `/api/students/public` | Criar aluno (formulário) | ❌ |
| GET | `/api/students/{id}` | Obter aluno | Personal |
| PUT | `/api/students/{id}` | Atualizar aluno | Personal |
| DELETE | `/api/students/{id}` | Remover aluno | Admin |
| GET | `/api/students/{id}/workouts` | Fichas do aluno | Personal |
| GET | `/api/requests` | Listar solicitações | Personal |
| GET | `/api/requests/{id}` | Obter solicitação | Personal |
| PUT | `/api/requests/{id}/status` | Atualizar status | Personal |
| GET | `/api/requests/pending-count` | Contagem pendentes | Personal |
| POST | `/api/workouts` | Criar ficha | Personal |
| GET | `/api/workouts` | Listar fichas | Personal |
| GET | `/api/workouts/download/{token}` | Download ficha | ❌ |
| GET | `/api/settings/custom-fields` | Listar campos | Personal |
| POST | `/api/settings/custom-fields` | Criar campo | Personal |
| PUT | `/api/settings/custom-fields/{id}` | Atualizar campo | Personal |
| DELETE | `/api/settings/custom-fields/{id}` | Remover campo | Personal |
| GET | `/api/settings/custom-fields/public/{personal_id}` | Campos públicos | ❌ |

---

## 🔐 Considerações de Segurança

1. **Multi-Tenancy**: Todas as queries filtram por `tenant_id`
2. **Roles em tabela separada**: Evita ataques de escalação de privilégios
3. **JWT com claims**: Token contém tenant_id e roles
4. **Soft delete**: Dados não são removidos permanentemente
5. **Rate limiting**: Nginx limita requisições por IP
6. **CORS configurável**: Apenas origens permitidas
7. **Senhas com hash**: bcrypt via Werkzeug
8. **Tokens de download**: Links únicos com expiração

---

## 🎯 Próximos Passos

1. Clone o repositório
2. Configure as variáveis de ambiente
3. Execute `docker-compose up -d`
4. Acesse `http://localhost:5000/api/health`
5. Execute as migrations: `docker-compose exec api flask db upgrade`
6. Popule com dados iniciais usando um script seed

Para dúvidas ou suporte, entre em contato via WhatsApp: +55 88 99291-2990
