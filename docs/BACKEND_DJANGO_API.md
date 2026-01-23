# 📋 Ficha.Life - Documentação Backend Django

> **Spec Kit para IA (Windsurf)** - Documentação estruturada para criação do backend

---

## 📌 Visão Geral do Sistema

**Ficha.Life** é uma plataforma SaaS multi-tenant para gestão de fichas de treino em academias.

### Stack Definitiva
- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Django 5.x + Django REST Framework
- **Banco de Dados:** PostgreSQL 15+
- **Multi-tenant:** Shared schema com `tenant_id` (NÃO usar subdomínios ou schemas separados)
- **Identificação do Tenant:** Path-based (`ficha.life/academia1`)
- **Autenticação:** JWT com `tenant_id` no payload
- **Upload de Arquivos:** MinIO (compatível S3)
- **Pagamentos:** Mercado Pago SDK (pip)
- **Segurança:** QuerySets protegidos + testes de isolamento

### Regras Fundamentais
1. ❌ NÃO assumir subdomínios
2. ❌ NÃO usar schema por tenant
3. ❌ NÃO colocar regras de segurança no frontend
4. ✅ Backend é SEMPRE a autoridade final
5. ✅ Todo QuerySet DEVE filtrar por `tenant_id`

---

## 👥 Papéis do Sistema

### 1. Admin (Superusuário do Sistema)
- **Escopo:** Global (acessa todas as academias)
- **URL Base:** `/admin-system/`
- **Responsabilidades:**
  - Ver todas as academias cadastradas
  - Ver status de pagamento de cada academia
  - Bloquear/liberar academias
  - Alterar senhas de gerentes
  - Ver informações de planos
  - Gerenciar solicitações de páginas personalizadas (Elite)

### 2. Gerente (Academia)
- **Escopo:** Tenant específico
- **URL Base:** `/{slug}/gerente/`
- **Responsabilidades:**
  - Gerenciar personais (CRUD)
  - Gerenciar alunos (visualizar, não criar diretamente)
  - Configurar termos de uso e política de privacidade
  - Gerenciar produtos da loja (se plano permitir)
  - Definir permissões dos personais (deletar alunos, criar campos)
  - Cadastrar produtos da loja ou delegar ao personal
  - Ver histórico de pagamentos da academia

### 3. Personal
- **Escopo:** Alunos vinculados a ele
- **URL Base:** `/{slug}/personal/`
- **Responsabilidades:**
  - Ver e atender solicitações de fichas
  - Criar senha do aluno ao atender solicitação
  - Definir prazo de validade da ficha
  - Criar fichas de treino (texto, imagem ou PDF)
  - Editar informações dos alunos
  - Ver gráficos de evolução dos alunos
  - Cadastrar produtos da loja (se permitido pelo gerente)
  - Criar campos adicionais no formulário (se plano e permissão permitirem)

### 4. Aluno
- **Escopo:** Seus próprios dados
- **URL Base:** `/{slug}/aluno/`
- **Responsabilidades:**
  - Criar solicitação via formulário público (sem login)
  - Acessar painel após personal criar senha
  - Ver histórico de formulários por período
  - Ver gráficos de evolução pessoal
  - Solicitar atualização de ficha
  - Acessar loja da academia (se disponível)

---

## 💎 Planos e Funcionalidades

### Matriz de Funcionalidades por Plano

| Funcionalidade | Master | Premium | Elite |
|----------------|--------|---------|-------|
| Painel do Gerente | ✅ | ✅ | ✅ |
| Painel do Personal | ✅ | ✅ | ✅ |
| Painel do Aluno | ✅ | ✅ | ✅ |
| Limite de Personais | 1 | 3 | 10 |
| Alunos Ilimitados | ✅ | ✅ | ✅ |
| Integração WhatsApp | ✅ | ✅ | ✅ |
| Formulário de Solicitação | ✅ | ✅ | ✅ |
| Campos Adicionais Formulário | ❌ | ✅ | ✅ |
| Gráficos Inteligentes | ❌ | ✅ | ✅ |
| Lojinha de Produtos | ❌ | ❌ | ✅ |
| Página de Planos Academia | ❌ | ❌ | ✅* |

> *Página de planos: Requer solicitação ao Admin do sistema, que cria manualmente e envia o link.

### Implementação de Limites

```python
# services/plan_features.py

PLAN_LIMITS = {
    'master': {
        'max_personals': 1,
        'custom_fields': False,
        'charts': False,
        'shop': False,
        'custom_page': False,
    },
    'premium': {
        'max_personals': 3,
        'custom_fields': True,
        'charts': True,
        'shop': False,
        'custom_page': False,
    },
    'elite': {
        'max_personals': 10,
        'custom_fields': True,
        'charts': True,
        'shop': True,
        'custom_page': True,
    },
}

def can_add_personal(academia):
    limit = PLAN_LIMITS[academia.plan]['max_personals']
    current = academia.personals.filter(is_active=True).count()
    return current < limit

def has_feature(academia, feature):
    return PLAN_LIMITS[academia.plan].get(feature, False)
```

---

## 🗄️ Estrutura do Projeto Django

```
ficha_life/
├── manage.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env.example
│
├── config/
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
│
├── apps/
│   ├── __init__.py
│   │
│   ├── core/                    # Módulo central
│   │   ├── models.py            # BaseModel com tenant_id
│   │   ├── managers.py          # TenantAwareManager
│   │   ├── middleware.py        # TenantMiddleware
│   │   ├── permissions.py       # Permissões customizadas
│   │   └── mixins.py            # TenantQuerySetMixin
│   │
│   ├── accounts/                # Usuários e autenticação
│   │   ├── models.py            # User, Admin customizado
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── tenants/                 # Academias (tenants)
│   │   ├── models.py            # Academia, Plano
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── personals/               # Personais
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── students/                # Alunos
│   │   ├── models.py            # Aluno, Evolução
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── forms/                   # Formulários e Solicitações
│   │   ├── models.py            # Solicitação, CampoPersonalizado
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── workouts/                # Fichas de Treino
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── shop/                    # Loja (Elite)
│   │   ├── models.py            # Produto
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── payments/                # Mercado Pago
│   │   ├── models.py            # Pagamento, Assinatura
│   │   ├── services.py          # MercadoPagoService
│   │   ├── webhooks.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   └── admin_system/            # Painel Admin do sistema
│       ├── views.py
│       ├── serializers.py
│       └── urls.py
│
├── storage/                     # MinIO client
│   ├── __init__.py
│   └── minio_client.py
│
└── tests/
    ├── test_tenant_isolation.py
    ├── test_permissions.py
    └── test_plans.py
```

---

## 📊 Models (Django ORM)

### Core - BaseModel

```python
# apps/core/models.py
from django.db import models
from django.conf import settings
import uuid

class BaseModel(models.Model):
    """Base model com campos padrão"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class TenantAwareModel(BaseModel):
    """Base model com tenant_id obrigatório"""
    academia = models.ForeignKey(
        'tenants.Academia',
        on_delete=models.CASCADE,
        related_name='%(class)ss'
    )

    class Meta:
        abstract = True
```

### Accounts - Usuários

```python
# apps/accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.core.models import BaseModel
import uuid

class User(AbstractUser):
    """Usuário base do sistema"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    ROLE_CHOICES = [
        ('admin', 'Admin Sistema'),
        ('gerente', 'Gerente Academia'),
        ('personal', 'Personal Trainer'),
        ('aluno', 'Aluno'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    whatsapp = models.CharField(max_length=20, blank=True)
    avatar = models.URLField(blank=True, null=True)
    
    # Relacionamento com academia (null para admin do sistema)
    academia = models.ForeignKey(
        'tenants.Academia',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='users'
    )
    
    # Campos específicos para alunos
    personal = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='alunos',
        limit_choices_to={'role': 'personal'}
    )
    
    # Campos específicos para personais
    can_delete_students = models.BooleanField(default=False)
    can_create_custom_fields = models.BooleanField(default=False)
    can_manage_shop = models.BooleanField(default=False)
    
    # Campos de perfil do aluno
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=10,
        choices=[('male', 'Masculino'), ('female', 'Feminino'), ('other', 'Outro')],
        blank=True
    )
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"
```

### Tenants - Academias

```python
# apps/tenants/models.py
from django.db import models
from apps.core.models import BaseModel

class Plano(BaseModel):
    """Planos disponíveis no sistema"""
    PLAN_CHOICES = [
        ('master', 'Master'),
        ('premium', 'Premium'),
        ('elite', 'Elite'),
    ]
    
    name = models.CharField(max_length=20, choices=PLAN_CHOICES, unique=True)
    price_monthly = models.DecimalField(max_digits=10, decimal_places=2)
    price_yearly = models.DecimalField(max_digits=10, decimal_places=2)
    max_personals = models.PositiveIntegerField()
    has_custom_fields = models.BooleanField(default=False)
    has_charts = models.BooleanField(default=False)
    has_shop = models.BooleanField(default=False)
    has_custom_page = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    
    class Meta:
        db_table = 'planos'
    
    def __str__(self):
        return self.get_name_display()


class Academia(BaseModel):
    """Tenant - Academia"""
    slug = models.SlugField(unique=True, max_length=100)
    name = models.CharField(max_length=200)
    logo = models.URLField(blank=True, null=True)
    whatsapp = models.CharField(max_length=20)
    email = models.EmailField()
    
    # Plano e pagamento
    plano = models.ForeignKey(Plano, on_delete=models.PROTECT, related_name='academias')
    is_active = models.BooleanField(default=False)  # Ativado após pagamento
    blocked = models.BooleanField(default=False)    # Bloqueado pelo admin
    blocked_reason = models.TextField(blank=True)
    
    # Termos e políticas
    terms_of_use = models.TextField(blank=True)
    privacy_policy = models.TextField(blank=True)
    
    # Mercado Pago
    mp_subscription_id = models.CharField(max_length=100, blank=True, null=True)
    mp_payer_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Página personalizada (Elite)
    custom_page_url = models.URLField(blank=True, null=True)
    custom_page_requested = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'academias'
    
    def __str__(self):
        return self.name
    
    @property
    def can_access(self):
        return self.is_active and not self.blocked
    
    def can_add_personal(self):
        current = self.users.filter(role='personal', is_active=True).count()
        return current < self.plano.max_personals
    
    def has_feature(self, feature):
        feature_map = {
            'custom_fields': self.plano.has_custom_fields,
            'charts': self.plano.has_charts,
            'shop': self.plano.has_shop,
            'custom_page': self.plano.has_custom_page,
        }
        return feature_map.get(feature, False)
```

### Forms - Solicitações

```python
# apps/forms/models.py
from django.db import models
from apps.core.models import TenantAwareModel, BaseModel

class CampoPersonalizado(TenantAwareModel):
    """Campos adicionais do formulário (Premium/Elite)"""
    FIELD_TYPES = [
        ('text', 'Texto'),
        ('number', 'Número'),
        ('select', 'Seleção'),
        ('boolean', 'Sim/Não'),
        ('textarea', 'Texto Longo'),
        ('date', 'Data'),
    ]
    
    personal = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='campos_personalizados',
        limit_choices_to={'role': 'personal'}
    )
    name = models.CharField(max_length=100)  # nome_interno
    label = models.CharField(max_length=200)  # Label exibido
    field_type = models.CharField(max_length=20, choices=FIELD_TYPES)
    options = models.JSONField(default=list, blank=True)  # Para select
    required = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        db_table = 'campos_personalizados'
        ordering = ['order']


class Solicitacao(TenantAwareModel):
    """Solicitação de ficha de treino"""
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('in_progress', 'Em Andamento'),
        ('completed', 'Concluída'),
    ]
    
    # Relacionamentos
    aluno = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='solicitacoes',
        limit_choices_to={'role': 'aluno'}
    )
    personal = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='solicitacoes_recebidas',
        limit_choices_to={'role': 'personal'}
    )
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Período de validade (definido pelo personal ao atender)
    period_start = models.DateField(null=True, blank=True)
    period_end = models.DateField(null=True, blank=True)
    
    # Dados básicos
    objective = models.CharField(max_length=200, blank=True)
    experience = models.CharField(max_length=100, blank=True)
    weekly_frequency = models.PositiveIntegerField(null=True, blank=True)
    available_time = models.PositiveIntegerField(null=True, blank=True)  # minutos
    
    # Saúde
    injuries = models.TextField(blank=True)
    diseases = models.TextField(blank=True)
    medications = models.TextField(blank=True)
    surgeries = models.TextField(blank=True)
    pain_points = models.TextField(blank=True)
    
    # Hábitos
    activity_level = models.CharField(max_length=50, blank=True)
    profession = models.CharField(max_length=100, blank=True)
    sleep_hours = models.PositiveIntegerField(null=True, blank=True)
    sleep_quality = models.CharField(
        max_length=20,
        choices=[
            ('poor', 'Ruim'),
            ('regular', 'Regular'),
            ('good', 'Boa'),
            ('excellent', 'Excelente'),
        ],
        blank=True
    )
    has_nutritionist = models.BooleanField(default=False)
    water_intake = models.CharField(max_length=50, blank=True)
    
    # Preferências
    preferred_time = models.CharField(max_length=50, blank=True)
    training_location = models.CharField(max_length=100, blank=True)
    liked_exercises = models.TextField(blank=True)
    disliked_exercises = models.TextField(blank=True)
    additional_notes = models.TextField(blank=True)
    
    # Campos personalizados
    custom_fields_data = models.JSONField(default=dict, blank=True)
    
    # Termos
    accepted_terms = models.BooleanField(default=False)
    accepted_privacy = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'solicitacoes'
        ordering = ['-created_at']
    
    @property
    def is_expired(self):
        if not self.period_end:
            return False
        from django.utils import timezone
        return timezone.now().date() > self.period_end
    
    @property
    def can_update(self):
        """Aluno pode atualizar se expirado ou se status for completed"""
        return self.is_expired or self.status == 'completed'
```

### Workouts - Fichas de Treino

```python
# apps/workouts/models.py
from django.db import models
from apps.core.models import TenantAwareModel

class FichaTreino(TenantAwareModel):
    """Ficha de treino criada pelo personal"""
    FILE_TYPE_CHOICES = [
        ('text', 'Texto'),
        ('pdf', 'PDF'),
        ('image', 'Imagem'),
    ]
    
    solicitacao = models.OneToOneField(
        'forms.Solicitacao',
        on_delete=models.CASCADE,
        related_name='ficha'
    )
    aluno = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='fichas'
    )
    personal = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='fichas_criadas'
    )
    
    # Tipo de divisão
    training_type = models.CharField(max_length=50, blank=True)  # ABC, ABCD, Full Body
    muscle_split = models.TextField(blank=True)
    
    # Conteúdo
    file_type = models.CharField(max_length=10, choices=FILE_TYPE_CHOICES, default='text')
    text_content = models.TextField(blank=True)
    file_url = models.URLField(blank=True, null=True)  # MinIO URL
    
    # Link seguro para compartilhamento
    secure_token = models.CharField(max_length=64, unique=True)
    
    personal_notes = models.TextField(blank=True)
    valid_until = models.DateField(null=True, blank=True)
    
    class Meta:
        db_table = 'fichas_treino'
    
    def generate_secure_link(self):
        from django.conf import settings
        return f"{settings.FRONTEND_URL}/ficha/{self.secure_token}"
```

### Students - Evolução

```python
# apps/students/models.py
from django.db import models
from apps.core.models import TenantAwareModel

class Evolucao(TenantAwareModel):
    """Registro de evolução do aluno"""
    aluno = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='evolucoes'
    )
    solicitacao = models.ForeignKey(
        'forms.Solicitacao',
        on_delete=models.CASCADE,
        related_name='evolucoes'
    )
    
    date = models.DateField()
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    sleep_hours = models.PositiveIntegerField(null=True, blank=True)
    sleep_quality = models.CharField(max_length=20, blank=True)
    training_time = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'evolucoes'
        ordering = ['date']
```

### Shop - Loja

```python
# apps/shop/models.py
from django.db import models
from apps.core.models import TenantAwareModel

class Produto(TenantAwareModel):
    """Produto da loja (Elite)"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    # Quem cadastrou
    created_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='produtos_cadastrados'
    )
    
    class Meta:
        db_table = 'produtos'
    
    def get_whatsapp_link(self, academia_whatsapp):
        message = f"Olá! Tenho interesse no produto: {self.name} - R$ {self.price}"
        from urllib.parse import quote
        return f"https://wa.me/{academia_whatsapp}?text={quote(message)}"
```

### Payments - Mercado Pago

```python
# apps/payments/models.py
from django.db import models
from apps.core.models import BaseModel

class Pagamento(BaseModel):
    """Registro de pagamento"""
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('approved', 'Aprovado'),
        ('rejected', 'Rejeitado'),
        ('refunded', 'Reembolsado'),
    ]
    
    academia = models.ForeignKey(
        'tenants.Academia',
        on_delete=models.CASCADE,
        related_name='pagamentos'
    )
    
    mp_payment_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)  # pix, credit_card
    
    # Dados do período
    period_start = models.DateField()
    period_end = models.DateField()
    
    mp_response = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'pagamentos'
        ordering = ['-created_at']


class Assinatura(BaseModel):
    """Assinatura recorrente"""
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('authorized', 'Autorizada'),
        ('paused', 'Pausada'),
        ('cancelled', 'Cancelada'),
    ]
    
    academia = models.OneToOneField(
        'tenants.Academia',
        on_delete=models.CASCADE,
        related_name='assinatura'
    )
    
    mp_subscription_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    plano = models.ForeignKey('tenants.Plano', on_delete=models.PROTECT)
    
    next_payment_date = models.DateField(null=True, blank=True)
    
    class Meta:
        db_table = 'assinaturas'
```

---

## 🔐 Middleware Multi-Tenant

```python
# apps/core/middleware.py
from django.http import Http404
from apps.tenants.models import Academia

class TenantMiddleware:
    """
    Identifica o tenant pela URL path-based.
    Ex: /academia1/api/... -> tenant = academia1
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        
        # Rotas que não precisam de tenant
        self.excluded_paths = [
            '/api/auth/',
            '/api/onboarding/',
            '/api/admin-system/',
            '/api/webhooks/',
            '/admin/',
            '/static/',
            '/media/',
        ]
    
    def __call__(self, request):
        request.academia = None
        
        # Verificar se é rota excluída
        for path in self.excluded_paths:
            if request.path.startswith(path):
                return self.get_response(request)
        
        # Extrair slug da URL
        # Formato esperado: /{slug}/api/...
        path_parts = request.path.strip('/').split('/')
        
        if len(path_parts) >= 1:
            potential_slug = path_parts[0]
            
            try:
                academia = Academia.objects.get(slug=potential_slug)
                
                # Verificar se academia está acessível
                if not academia.can_access:
                    from django.http import JsonResponse
                    return JsonResponse({
                        'error': 'Academia bloqueada ou inativa',
                        'blocked': academia.blocked,
                        'active': academia.is_active
                    }, status=403)
                
                request.academia = academia
                
            except Academia.DoesNotExist:
                pass  # Continua sem tenant (pode ser rota pública)
        
        return self.get_response(request)
```

---

## 🛡️ Managers e QuerySets Seguros

```python
# apps/core/managers.py
from django.db import models

class TenantAwareManager(models.Manager):
    """Manager que SEMPRE filtra por academia"""
    
    def for_academia(self, academia):
        return self.get_queryset().filter(academia=academia)
    
    def for_request(self, request):
        if not hasattr(request, 'academia') or not request.academia:
            return self.get_queryset().none()
        return self.for_academia(request.academia)


class TenantAwareQuerySet(models.QuerySet):
    """QuerySet com métodos de filtragem por tenant"""
    
    def for_academia(self, academia):
        return self.filter(academia=academia)
```

---

## 🔑 Autenticação JWT

```python
# apps/accounts/serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """JWT customizado com tenant_id e role no payload"""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Adicionar claims customizados
        token['role'] = user.role
        token['name'] = user.get_full_name()
        
        if user.academia:
            token['academia_id'] = str(user.academia.id)
            token['academia_slug'] = user.academia.slug
        
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Adicionar dados extras na resposta
        data['user'] = {
            'id': str(self.user.id),
            'name': self.user.get_full_name(),
            'email': self.user.email,
            'role': self.user.role,
            'avatar': self.user.avatar,
        }
        
        if self.user.academia:
            data['academia'] = {
                'id': str(self.user.academia.id),
                'slug': self.user.academia.slug,
                'name': self.user.academia.name,
                'plano': self.user.academia.plano.name,
            }
        
        return data
```

---

## 🔒 Permissões

```python
# apps/core/permissions.py
from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """Apenas admin do sistema"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsGerente(permissions.BasePermission):
    """Apenas gerente da academia"""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == 'gerente' and
            request.academia and
            request.user.academia == request.academia
        )


class IsPersonal(permissions.BasePermission):
    """Apenas personal da academia"""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == 'personal' and
            request.academia and
            request.user.academia == request.academia
        )


class IsAluno(permissions.BasePermission):
    """Apenas aluno da academia"""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == 'aluno' and
            request.academia and
            request.user.academia == request.academia
        )


class IsGerenteOrPersonal(permissions.BasePermission):
    """Gerente OU Personal da academia"""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role in ['gerente', 'personal'] and
            request.academia and
            request.user.academia == request.academia
        )


class HasFeature(permissions.BasePermission):
    """Verifica se academia tem feature específica"""
    feature = None
    
    def has_permission(self, request, view):
        if not request.academia:
            return False
        return request.academia.has_feature(self.feature)


class HasShopFeature(HasFeature):
    feature = 'shop'


class HasChartsFeature(HasFeature):
    feature = 'charts'


class HasCustomFieldsFeature(HasFeature):
    feature = 'custom_fields'
```

---

## 📡 Endpoints da API

### URLs Principal

```python
# config/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Rotas globais (sem tenant)
    path('api/auth/', include('apps.accounts.urls')),
    path('api/onboarding/', include('apps.payments.urls_onboarding')),
    path('api/webhooks/', include('apps.payments.urls_webhooks')),
    path('api/admin-system/', include('apps.admin_system.urls')),
    
    # Rotas com tenant
    path('<slug:academia_slug>/api/', include('apps.tenants.urls_tenant')),
]
```

### Onboarding (Cadastro de Academia)

```python
# apps/payments/views_onboarding.py
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .services import MercadoPagoService
from apps.tenants.models import Academia, Plano

class PlanoListView(APIView):
    """Lista planos disponíveis"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        planos = Plano.objects.all()
        return Response([{
            'id': str(p.id),
            'name': p.name,
            'price_monthly': str(p.price_monthly),
            'price_yearly': str(p.price_yearly),
            'max_personals': p.max_personals,
            'features': {
                'custom_fields': p.has_custom_fields,
                'charts': p.has_charts,
                'shop': p.has_shop,
                'custom_page': p.has_custom_page,
            }
        } for p in planos])


class OnboardingView(APIView):
    """Cadastro de nova academia com pagamento"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Payload esperado:
        {
            "academia": {
                "name": "Academia XYZ",
                "slug": "xyz-fitness",
                "email": "contato@xyz.com",
                "whatsapp": "+5511999999999"
            },
            "gerente": {
                "name": "João Silva",
                "email": "joao@xyz.com",
                "password": "senha123"
            },
            "plano_id": "uuid-do-plano",
            "payment_method": "pix" | "credit_card",
            "card_token": "token-do-cartao" (se credit_card)
        }
        """
        # Validar dados
        # Criar academia com is_active=False
        # Criar gerente
        # Criar pagamento via Mercado Pago
        # Retornar dados para pagamento (QR Code Pix ou confirmação)
        pass


class CheckSlugView(APIView):
    """Verifica disponibilidade do slug"""
    permission_classes = [AllowAny]
    
    def get(self, request, slug):
        exists = Academia.objects.filter(slug=slug).exists()
        return Response({'available': not exists})
```

### Admin do Sistema

```python
# apps/admin_system/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.permissions import IsAdmin
from apps.tenants.models import Academia
from apps.payments.models import Pagamento

class AcademiaAdminViewSet(viewsets.ModelViewSet):
    """CRUD de academias para admin do sistema"""
    permission_classes = [IsAdmin]
    queryset = Academia.objects.all()
    
    @action(detail=True, methods=['post'])
    def bloquear(self, request, pk=None):
        academia = self.get_object()
        academia.blocked = True
        academia.blocked_reason = request.data.get('reason', '')
        academia.save()
        return Response({'status': 'bloqueada'})
    
    @action(detail=True, methods=['post'])
    def liberar(self, request, pk=None):
        academia = self.get_object()
        academia.blocked = False
        academia.blocked_reason = ''
        academia.save()
        return Response({'status': 'liberada'})
    
    @action(detail=True, methods=['post'])
    def alterar_senha_gerente(self, request, pk=None):
        academia = self.get_object()
        gerente = academia.users.filter(role='gerente').first()
        if gerente:
            gerente.set_password(request.data.get('new_password'))
            gerente.save()
            return Response({'status': 'senha alterada'})
        return Response({'error': 'gerente não encontrado'}, status=404)
    
    @action(detail=True, methods=['get'])
    def pagamentos(self, request, pk=None):
        academia = self.get_object()
        pagamentos = academia.pagamentos.all()[:20]
        return Response([{
            'id': str(p.id),
            'status': p.status,
            'amount': str(p.amount),
            'method': p.payment_method,
            'date': p.created_at.isoformat(),
        } for p in pagamentos])


class DashboardAdminView(APIView):
    """Dashboard do admin do sistema"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        from django.db.models import Count, Sum
        
        return Response({
            'total_academias': Academia.objects.count(),
            'academias_ativas': Academia.objects.filter(is_active=True, blocked=False).count(),
            'academias_bloqueadas': Academia.objects.filter(blocked=True).count(),
            'por_plano': list(
                Academia.objects.values('plano__name')
                .annotate(count=Count('id'))
            ),
            'receita_mes': str(
                Pagamento.objects.filter(
                    status='approved',
                    created_at__month=timezone.now().month
                ).aggregate(total=Sum('amount'))['total'] or 0
            ),
        })
```

### Gerente (Academia)

```python
# apps/tenants/views_gerente.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.permissions import IsGerente
from apps.accounts.models import User

class PersonalViewSet(viewsets.ModelViewSet):
    """CRUD de personais pelo gerente"""
    permission_classes = [IsGerente]
    
    def get_queryset(self):
        return User.objects.filter(
            academia=self.request.academia,
            role='personal'
        )
    
    def perform_create(self, serializer):
        # Verificar limite do plano
        if not self.request.academia.can_add_personal():
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                f"Limite de personais atingido para o plano {self.request.academia.plano.name}"
            )
        
        serializer.save(
            academia=self.request.academia,
            role='personal'
        )
    
    @action(detail=True, methods=['post'])
    def toggle_permission(self, request, pk=None):
        """Alterna permissões do personal"""
        personal = self.get_object()
        permission = request.data.get('permission')
        
        if permission == 'delete_students':
            personal.can_delete_students = not personal.can_delete_students
        elif permission == 'custom_fields':
            if self.request.academia.has_feature('custom_fields'):
                personal.can_create_custom_fields = not personal.can_create_custom_fields
        elif permission == 'shop':
            if self.request.academia.has_feature('shop'):
                personal.can_manage_shop = not personal.can_manage_shop
        
        personal.save()
        return Response({'status': 'ok'})


class ConfiguracaoAcademiaView(APIView):
    """Configurações da academia"""
    permission_classes = [IsGerente]
    
    def get(self, request):
        academia = request.academia
        return Response({
            'name': academia.name,
            'logo': academia.logo,
            'whatsapp': academia.whatsapp,
            'terms_of_use': academia.terms_of_use,
            'privacy_policy': academia.privacy_policy,
            'plano': {
                'name': academia.plano.name,
                'features': {
                    'custom_fields': academia.plano.has_custom_fields,
                    'charts': academia.plano.has_charts,
                    'shop': academia.plano.has_shop,
                }
            }
        })
    
    def patch(self, request):
        academia = request.academia
        for field in ['name', 'logo', 'whatsapp', 'terms_of_use', 'privacy_policy']:
            if field in request.data:
                setattr(academia, field, request.data[field])
        academia.save()
        return Response({'status': 'ok'})
```

### Personal

```python
# apps/personals/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.permissions import IsPersonal, HasCustomFieldsFeature
from apps.forms.models import Solicitacao, CampoPersonalizado
from apps.workouts.models import FichaTreino
import secrets

class SolicitacaoPersonalViewSet(viewsets.ModelViewSet):
    """Gerenciamento de solicitações pelo personal"""
    permission_classes = [IsPersonal]
    
    def get_queryset(self):
        return Solicitacao.objects.filter(
            academia=self.request.academia,
            personal=self.request.user
        )
    
    @action(detail=True, methods=['post'])
    def atender(self, request, pk=None):
        """
        Atende a solicitação:
        - Cria senha para o aluno
        - Define período de validade
        - Cria ficha de treino
        - Envia via WhatsApp
        """
        solicitacao = self.get_object()
        
        # Dados esperados
        password = request.data.get('password')
        period_end = request.data.get('period_end')
        ficha_type = request.data.get('ficha_type', 'text')
        ficha_content = request.data.get('ficha_content')
        ficha_file = request.FILES.get('ficha_file')
        
        # Criar/atualizar senha do aluno
        aluno = solicitacao.aluno
        if password:
            aluno.set_password(password)
            aluno.save()
        
        # Atualizar solicitação
        from django.utils import timezone
        solicitacao.status = 'completed'
        solicitacao.period_start = timezone.now().date()
        solicitacao.period_end = period_end
        solicitacao.save()
        
        # Criar ficha
        ficha = FichaTreino.objects.create(
            academia=self.request.academia,
            solicitacao=solicitacao,
            aluno=aluno,
            personal=self.request.user,
            file_type=ficha_type,
            text_content=ficha_content if ficha_type == 'text' else '',
            secure_token=secrets.token_urlsafe(32)
        )
        
        # Upload de arquivo se necessário
        if ficha_file:
            from storage.minio_client import upload_file
            ficha.file_url = upload_file(ficha_file, f"fichas/{ficha.id}")
            ficha.save()
        
        # Registrar evolução
        from apps.students.models import Evolucao
        Evolucao.objects.create(
            academia=self.request.academia,
            aluno=aluno,
            solicitacao=solicitacao,
            date=timezone.now().date(),
            weight=aluno.weight or 0,
            height=aluno.height,
            sleep_hours=solicitacao.sleep_hours,
            sleep_quality=solicitacao.sleep_quality,
        )
        
        # Gerar link WhatsApp
        secure_link = ficha.generate_secure_link()
        whatsapp_message = f"""
🏋️ Sua ficha está pronta!

Olá {aluno.first_name}!

Sua ficha de treino foi criada.

📋 Acesse sua ficha: {secure_link}

🔐 Acesso ao painel:
Email: {aluno.email}
Senha: {password}

Qualquer dúvida, estou à disposição!
        """
        
        from urllib.parse import quote
        whatsapp_link = f"https://wa.me/{aluno.whatsapp}?text={quote(whatsapp_message)}"
        
        return Response({
            'status': 'completed',
            'ficha_link': secure_link,
            'whatsapp_link': whatsapp_link,
        })


class CampoPersonalizadoViewSet(viewsets.ModelViewSet):
    """CRUD de campos personalizados (Premium/Elite)"""
    permission_classes = [IsPersonal, HasCustomFieldsFeature]
    
    def get_queryset(self):
        return CampoPersonalizado.objects.filter(
            academia=self.request.academia,
            personal=self.request.user
        )
    
    def perform_create(self, serializer):
        # Verificar permissão do personal
        if not self.request.user.can_create_custom_fields:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Você não tem permissão para criar campos personalizados")
        
        serializer.save(
            academia=self.request.academia,
            personal=self.request.user
        )
```

### Aluno

```python
# apps/students/views.py
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.core.permissions import IsAluno, HasChartsFeature, HasShopFeature

class FormularioPublicoView(APIView):
    """Formulário público (sem login)"""
    permission_classes = [AllowAny]
    
    def get(self, request, academia_slug, personal_id=None):
        """Retorna dados para o formulário"""
        from apps.tenants.models import Academia
        
        try:
            academia = Academia.objects.get(slug=academia_slug)
        except Academia.DoesNotExist:
            return Response({'error': 'Academia não encontrada'}, status=404)
        
        # Listar personais
        personais = User.objects.filter(
            academia=academia,
            role='personal',
            is_active=True
        ).values('id', 'first_name', 'last_name', 'avatar')
        
        # Campos personalizados (se tiver personal específico)
        campos = []
        if personal_id:
            campos = CampoPersonalizado.objects.filter(
                academia=academia,
                personal_id=personal_id
            ).values('id', 'name', 'label', 'field_type', 'options', 'required', 'order')
        
        return Response({
            'academia': {
                'name': academia.name,
                'logo': academia.logo,
                'terms_of_use': academia.terms_of_use,
                'privacy_policy': academia.privacy_policy,
            },
            'personais': list(personais),
            'campos_personalizados': list(campos),
        })
    
    def post(self, request, academia_slug):
        """Envia formulário - cria aluno e solicitação"""
        from apps.tenants.models import Academia
        
        try:
            academia = Academia.objects.get(slug=academia_slug)
        except Academia.DoesNotExist:
            return Response({'error': 'Academia não encontrada'}, status=404)
        
        data = request.data
        
        # Criar ou atualizar aluno
        aluno, created = User.objects.get_or_create(
            email=data.get('email'),
            academia=academia,
            defaults={
                'username': data.get('email'),
                'first_name': data.get('name', '').split()[0],
                'last_name': ' '.join(data.get('name', '').split()[1:]),
                'whatsapp': data.get('whatsapp'),
                'role': 'aluno',
                'personal_id': data.get('personal_id'),
                'birth_date': data.get('birth_date'),
                'gender': data.get('gender'),
                'height': data.get('height'),
                'weight': data.get('weight'),
            }
        )
        
        # Criar solicitação
        solicitacao = Solicitacao.objects.create(
            academia=academia,
            aluno=aluno,
            personal_id=data.get('personal_id'),
            objective=data.get('objective'),
            experience=data.get('experience'),
            weekly_frequency=data.get('weekly_frequency'),
            available_time=data.get('available_time'),
            injuries=data.get('injuries', ''),
            diseases=data.get('diseases', ''),
            medications=data.get('medications', ''),
            surgeries=data.get('surgeries', ''),
            pain_points=data.get('pain_points', ''),
            activity_level=data.get('activity_level', ''),
            profession=data.get('profession', ''),
            sleep_hours=data.get('sleep_hours'),
            sleep_quality=data.get('sleep_quality', ''),
            has_nutritionist=data.get('has_nutritionist', False),
            water_intake=data.get('water_intake', ''),
            preferred_time=data.get('preferred_time', ''),
            training_location=data.get('training_location', ''),
            liked_exercises=data.get('liked_exercises', ''),
            disliked_exercises=data.get('disliked_exercises', ''),
            additional_notes=data.get('additional_notes', ''),
            custom_fields_data=data.get('custom_fields_data', {}),
            accepted_terms=data.get('accepted_terms', False),
            accepted_privacy=data.get('accepted_privacy', False),
        )
        
        # Mensagem WhatsApp para academia
        message = f"""
Nova solicitação de ficha!

👤 Aluno: {aluno.get_full_name()}
📱 WhatsApp: {aluno.whatsapp}
🎯 Objetivo: {solicitacao.objective}

Acesse o painel para atender.
        """
        
        from urllib.parse import quote
        whatsapp_link = f"https://wa.me/{academia.whatsapp}?text={quote(message)}"
        
        return Response({
            'status': 'created',
            'message': 'Sua solicitação foi enviada! Logo seu personal entrará em contato.',
            'whatsapp_link': whatsapp_link,
        }, status=201)


class AlunoDashboardView(APIView):
    """Dashboard do aluno"""
    permission_classes = [IsAluno]
    
    def get(self, request):
        aluno = request.user
        
        # Solicitações
        solicitacoes = Solicitacao.objects.filter(aluno=aluno)
        
        # Última ficha
        ultima_ficha = FichaTreino.objects.filter(aluno=aluno).order_by('-created_at').first()
        
        # Verificar se pode solicitar atualização
        ultima_solicitacao = solicitacoes.order_by('-created_at').first()
        pode_atualizar = ultima_solicitacao.can_update if ultima_solicitacao else True
        
        return Response({
            'nome': aluno.get_full_name(),
            'personal': {
                'nome': aluno.personal.get_full_name() if aluno.personal else None,
                'whatsapp': aluno.personal.whatsapp if aluno.personal else None,
            },
            'ultima_ficha': {
                'link': ultima_ficha.generate_secure_link() if ultima_ficha else None,
                'valid_until': ultima_ficha.valid_until if ultima_ficha else None,
            } if ultima_ficha else None,
            'pode_atualizar': pode_atualizar,
            'total_solicitacoes': solicitacoes.count(),
            'features': {
                'charts': request.academia.has_feature('charts'),
                'shop': request.academia.has_feature('shop'),
            }
        })


class AlunoEvolucaoView(APIView):
    """Gráficos de evolução (Premium/Elite)"""
    permission_classes = [IsAluno, HasChartsFeature]
    
    def get(self, request):
        from apps.students.models import Evolucao
        
        evolucoes = Evolucao.objects.filter(
            aluno=request.user
        ).order_by('date')
        
        return Response({
            'evolucoes': [{
                'date': e.date.isoformat(),
                'weight': float(e.weight),
                'sleep_hours': e.sleep_hours,
                'sleep_quality': e.sleep_quality,
            } for e in evolucoes]
        })


class AlunoHistoricoView(APIView):
    """Histórico de formulários"""
    permission_classes = [IsAluno]
    
    def get(self, request):
        solicitacoes = Solicitacao.objects.filter(
            aluno=request.user
        ).order_by('-created_at')
        
        return Response([{
            'id': str(s.id),
            'status': s.status,
            'period_start': s.period_start.isoformat() if s.period_start else None,
            'period_end': s.period_end.isoformat() if s.period_end else None,
            'is_expired': s.is_expired,
            'objective': s.objective,
            'created_at': s.created_at.isoformat(),
        } for s in solicitacoes])


class LojaPublicaView(APIView):
    """Loja da academia (Elite)"""
    permission_classes = [IsAluno, HasShopFeature]
    
    def get(self, request):
        from apps.shop.models import Produto
        
        produtos = Produto.objects.filter(
            academia=request.academia,
            is_active=True
        )
        
        return Response([{
            'id': str(p.id),
            'name': p.name,
            'description': p.description,
            'price': str(p.price),
            'image_url': p.image_url,
            'whatsapp_link': p.get_whatsapp_link(request.academia.whatsapp),
        } for p in produtos])
```

---

## 💳 Integração Mercado Pago

### Instalação

```bash
pip install mercadopago
```

### Serviço

```python
# apps/payments/services.py
import mercadopago
from django.conf import settings

class MercadoPagoService:
    def __init__(self):
        self.sdk = mercadopago.SDK(settings.MERCADO_PAGO_ACCESS_TOKEN)
    
    def create_pix_payment(self, amount, description, payer_email, external_reference):
        """Cria pagamento via Pix"""
        payment_data = {
            "transaction_amount": float(amount),
            "description": description,
            "payment_method_id": "pix",
            "payer": {
                "email": payer_email,
            },
            "external_reference": external_reference,
            "notification_url": f"{settings.BACKEND_URL}/api/webhooks/mercadopago/",
        }
        
        result = self.sdk.payment().create(payment_data)
        return result["response"]
    
    def create_subscription(self, plan_id, payer_email, card_token=None):
        """Cria assinatura recorrente"""
        subscription_data = {
            "preapproval_plan_id": plan_id,
            "payer_email": payer_email,
            "card_token_id": card_token,
            "back_url": f"{settings.FRONTEND_URL}/onboarding/success",
        }
        
        result = self.sdk.preapproval().create(subscription_data)
        return result["response"]
    
    def get_payment(self, payment_id):
        """Consulta status do pagamento"""
        result = self.sdk.payment().get(payment_id)
        return result["response"]
    
    def cancel_subscription(self, subscription_id):
        """Cancela assinatura"""
        result = self.sdk.preapproval().update(subscription_id, {"status": "cancelled"})
        return result["response"]
```

### Webhook

```python
# apps/payments/webhooks.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .services import MercadoPagoService
from .models import Pagamento
from apps.tenants.models import Academia

class MercadoPagoWebhookView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Recebe notificações do Mercado Pago
        Tipos: payment, subscription
        """
        data = request.data
        
        if data.get('type') == 'payment':
            payment_id = data.get('data', {}).get('id')
            self.process_payment(payment_id)
        
        elif data.get('type') == 'subscription_preapproval':
            subscription_id = data.get('data', {}).get('id')
            self.process_subscription(subscription_id)
        
        return Response({'status': 'ok'})
    
    def process_payment(self, payment_id):
        mp = MercadoPagoService()
        payment_data = mp.get_payment(payment_id)
        
        external_ref = payment_data.get('external_reference')
        
        # external_reference formato: "academia:{academia_id}"
        if external_ref and external_ref.startswith('academia:'):
            academia_id = external_ref.split(':')[1]
            
            try:
                academia = Academia.objects.get(id=academia_id)
                
                # Registrar pagamento
                Pagamento.objects.update_or_create(
                    mp_payment_id=str(payment_id),
                    defaults={
                        'academia': academia,
                        'status': payment_data['status'],
                        'amount': payment_data['transaction_amount'],
                        'payment_method': payment_data['payment_method_id'],
                        'mp_response': payment_data,
                    }
                )
                
                # Ativar academia se aprovado
                if payment_data['status'] == 'approved':
                    academia.is_active = True
                    academia.save()
                    
            except Academia.DoesNotExist:
                pass
```

---

## 📁 Upload de Arquivos - MinIO

### Instalação

```bash
pip install minio
```

### Docker Compose para MinIO

```yaml
# docker-compose.yml (adicionar)
services:
  minio:
    image: minio/minio:latest
    container_name: ficha_life_minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

volumes:
  minio_data:
```

### Cliente MinIO

```python
# storage/minio_client.py
from minio import Minio
from django.conf import settings
import io
import uuid

def get_minio_client():
    return Minio(
        settings.MINIO_ENDPOINT,
        access_key=settings.MINIO_ACCESS_KEY,
        secret_key=settings.MINIO_SECRET_KEY,
        secure=settings.MINIO_USE_SSL,
    )

def ensure_bucket_exists(bucket_name):
    client = get_minio_client()
    if not client.bucket_exists(bucket_name):
        client.make_bucket(bucket_name)

def upload_file(file, folder):
    """
    Upload de arquivo para MinIO
    Retorna URL pública
    """
    client = get_minio_client()
    bucket = settings.MINIO_BUCKET
    
    ensure_bucket_exists(bucket)
    
    # Gerar nome único
    ext = file.name.split('.')[-1]
    filename = f"{folder}/{uuid.uuid4()}.{ext}"
    
    # Upload
    client.put_object(
        bucket,
        filename,
        file,
        file.size,
        content_type=file.content_type,
    )
    
    # Retornar URL
    return f"{settings.MINIO_PUBLIC_URL}/{bucket}/{filename}"

def get_presigned_url(filename, expires=3600):
    """Gera URL temporária para download"""
    client = get_minio_client()
    from datetime import timedelta
    
    return client.presigned_get_object(
        settings.MINIO_BUCKET,
        filename,
        expires=timedelta(seconds=expires)
    )

def delete_file(filename):
    """Remove arquivo"""
    client = get_minio_client()
    client.remove_object(settings.MINIO_BUCKET, filename)
```

### Configuração Django

```python
# config/settings/base.py

# MinIO
MINIO_ENDPOINT = os.getenv('MINIO_ENDPOINT', 'localhost:9000')
MINIO_ACCESS_KEY = os.getenv('MINIO_ACCESS_KEY')
MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY')
MINIO_BUCKET = os.getenv('MINIO_BUCKET', 'ficha-life')
MINIO_USE_SSL = os.getenv('MINIO_USE_SSL', 'false').lower() == 'true'
MINIO_PUBLIC_URL = os.getenv('MINIO_PUBLIC_URL', 'http://localhost:9000')
```

---

## 🐳 Docker e Deploy

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY . .

# Coletar arquivos estáticos
RUN python manage.py collectstatic --noinput

# Expor porta
EXPOSE 8000

# Comando
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    container_name: ficha_life_db
    environment:
      POSTGRES_DB: ficha_life
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  minio:
    image: minio/minio:latest
    container_name: ficha_life_minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"

  backend:
    build: .
    container_name: ficha_life_backend
    depends_on:
      - db
      - minio
    environment:
      - DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@db:5432/ficha_life
      - SECRET_KEY=${SECRET_KEY}
      - DEBUG=false
      - ALLOWED_HOSTS=${ALLOWED_HOSTS}
      - MERCADO_PAGO_ACCESS_TOKEN=${MERCADO_PAGO_ACCESS_TOKEN}
      - MINIO_ENDPOINT=minio:9000
      - MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
      - MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
    ports:
      - "8000:8000"
    volumes:
      - static_files:/app/staticfiles

  nginx:
    image: nginx:alpine
    container_name: ficha_life_nginx
    depends_on:
      - backend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - static_files:/app/staticfiles
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot

volumes:
  postgres_data:
  minio_data:
  static_files:
```

### requirements.txt

```
Django>=5.0
djangorestframework>=3.14
djangorestframework-simplejwt>=5.3
django-cors-headers>=4.3
psycopg2-binary>=2.9
gunicorn>=21.2
python-dotenv>=1.0
mercadopago>=2.2
minio>=7.2
Pillow>=10.1
django-filter>=23.5
drf-spectacular>=0.27  # OpenAPI docs
```

### .env.example

```env
# Django
SECRET_KEY=your-secret-key-here
DEBUG=false
ALLOWED_HOSTS=ficha.life,www.ficha.life

# Database
DB_USER=ficha_life
DB_PASSWORD=your-db-password

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=your-mp-token
MERCADO_PAGO_PUBLIC_KEY=your-mp-public-key

# MinIO
MINIO_ACCESS_KEY=your-minio-access
MINIO_SECRET_KEY=your-minio-secret
MINIO_BUCKET=ficha-life
MINIO_PUBLIC_URL=https://storage.ficha.life

# URLs
FRONTEND_URL=https://ficha.life
BACKEND_URL=https://api.ficha.life
```

---

## 🧪 Testes de Isolamento

```python
# tests/test_tenant_isolation.py
from django.test import TestCase
from rest_framework.test import APIClient
from apps.tenants.models import Academia, Plano
from apps.accounts.models import User

class TenantIsolationTest(TestCase):
    def setUp(self):
        # Criar plano
        self.plano = Plano.objects.create(
            name='master',
            price_monthly=99,
            price_yearly=999,
            max_personals=1
        )
        
        # Criar duas academias
        self.academia1 = Academia.objects.create(
            slug='academia1',
            name='Academia 1',
            plano=self.plano,
            is_active=True
        )
        self.academia2 = Academia.objects.create(
            slug='academia2',
            name='Academia 2',
            plano=self.plano,
            is_active=True
        )
        
        # Criar usuários
        self.gerente1 = User.objects.create_user(
            username='gerente1@academia1.com',
            email='gerente1@academia1.com',
            password='test123',
            role='gerente',
            academia=self.academia1
        )
        self.gerente2 = User.objects.create_user(
            username='gerente2@academia2.com',
            email='gerente2@academia2.com',
            password='test123',
            role='gerente',
            academia=self.academia2
        )
    
    def test_gerente_cannot_access_other_academia(self):
        """Gerente não pode acessar dados de outra academia"""
        client = APIClient()
        client.force_authenticate(user=self.gerente1)
        
        # Tentar acessar academia2
        response = client.get('/academia2/api/personais/')
        
        # Deve retornar 403 ou lista vazia
        self.assertIn(response.status_code, [403, 200])
        if response.status_code == 200:
            self.assertEqual(len(response.data), 0)
    
    def test_queryset_filters_by_tenant(self):
        """QuerySet deve filtrar por tenant automaticamente"""
        from apps.forms.models import Solicitacao
        
        # Criar solicitações em cada academia
        # ... (criar dados de teste)
        
        # Verificar isolamento
        solicitacoes_a1 = Solicitacao.objects.for_academia(self.academia1)
        solicitacoes_a2 = Solicitacao.objects.for_academia(self.academia2)
        
        for s in solicitacoes_a1:
            self.assertEqual(s.academia, self.academia1)
        
        for s in solicitacoes_a2:
            self.assertEqual(s.academia, self.academia2)
```

---

## 📋 Checklist de Implementação

### Fase 1: Core e Autenticação
- [ ] Configurar projeto Django
- [ ] Criar models base (BaseModel, TenantAwareModel)
- [ ] Implementar TenantMiddleware
- [ ] Configurar JWT com claims customizados
- [ ] Criar model User customizado
- [ ] Criar models Academia e Plano

### Fase 2: Admin do Sistema
- [ ] CRUD de Academias
- [ ] Bloquear/Liberar academias
- [ ] Visualizar pagamentos
- [ ] Alterar senhas de gerentes
- [ ] Dashboard com estatísticas

### Fase 3: Gerente (Academia)
- [ ] CRUD de Personais (com limite de plano)
- [ ] Configurações da academia
- [ ] Gerenciar permissões dos personais
- [ ] Visualizar alunos e solicitações

### Fase 4: Personal
- [ ] Listar solicitações pendentes
- [ ] Atender solicitação (criar senha, ficha, período)
- [ ] CRUD de alunos
- [ ] Campos personalizados (Premium/Elite)
- [ ] Visualizar evolução dos alunos

### Fase 5: Aluno
- [ ] Formulário público
- [ ] Dashboard do aluno
- [ ] Histórico de formulários
- [ ] Gráficos de evolução (Premium/Elite)
- [ ] Solicitar atualização de ficha
- [ ] Loja (Elite)

### Fase 6: Pagamentos
- [ ] Integração Mercado Pago
- [ ] Webhook de pagamentos
- [ ] Onboarding com pagamento
- [ ] Gestão de assinaturas

### Fase 7: Storage
- [ ] Configurar MinIO
- [ ] Upload de fichas (PDF/imagem)
- [ ] Links seguros para download

### Fase 8: Testes e Deploy
- [ ] Testes de isolamento de tenant
- [ ] Testes de permissões
- [ ] Configurar Docker
- [ ] Deploy em produção

---

## 🔗 Fluxos Principais

### Fluxo de Onboarding

```
1. Academia acessa ficha.life
2. Escolhe plano (Master/Premium/Elite)
3. Preenche dados da academia e gerente
4. Realiza pagamento (Pix ou cartão)
5. Webhook ativa academia automaticamente
6. Gerente recebe email com credenciais
7. Gerente acessa /{slug}/gerente/
```

### Fluxo de Solicitação de Ficha

```
1. Aluno acessa /{slug}/form/{personalId}
2. Preenche formulário + aceita termos
3. Clica em enviar → Redireciona para WhatsApp
4. Solicitação aparece no painel do Personal (status: pending)
5. Personal atende:
   - Define senha do aluno
   - Define período de validade
   - Cria ficha (texto/PDF/imagem)
   - Clica em "Atender"
6. Sistema envia WhatsApp para aluno com:
   - Link da ficha
   - Credenciais de acesso
7. Aluno acessa /{slug}/aluno/ com as credenciais
```

### Fluxo de Atualização de Ficha

```
1. Ficha expira OU aluno solicita atualização
2. Aluno acessa painel → "Solicitar Atualização"
3. Preenche novo formulário (dados anteriores podem mudar)
4. Cria nova solicitação com status pending
5. Formulário anterior fica no histórico
6. Personal atende novamente
7. Evolução é registrada automaticamente
```

---

> **Nota:** Esta documentação foi criada para ser usada como Spec Kit por IA (Windsurf). O desenvolvimento deve seguir a ordem do checklist, começando pelo Admin e Gerente.
