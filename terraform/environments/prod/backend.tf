# environments/prod/backend.tf
# Configuration du backend pour l'environnement PRODUCTION
# En production, TOUJOURS utiliser un backend distant

# ══════════════════════════════════════════════════════════════════════════════
# TERRAFORM CLOUD (Recommandé pour production)
# ══════════════════════════════════════════════════════════════════════════════

# terraform {
#   cloud {
#     organization = "votre-organisation"
#     
#     workspaces {
#       name = "devops-portfolio-prod"
#     }
#   }
# }

# ══════════════════════════════════════════════════════════════════════════════
# AWS S3 BACKEND (Alternative pour AWS)
# ══════════════════════════════════════════════════════════════════════════════

# terraform {
#   backend "s3" {
#     bucket         = "my-terraform-state"
#     key            = "devops-portfolio/prod/terraform.tfstate"
#     region         = "us-east-1"
#     encrypt        = true
#     dynamodb_table = "terraform-state-lock-prod"
#     
#     # Tags pour le bucket
#     tags = {
#       Environment = "production"
#       Project     = "devops-portfolio-mern"
#       ManagedBy   = "terraform"
#     }
#   }
# }

# ══════════════════════════════════════════════════════════════════════════════
# AZURE BLOB STORAGE (Alternative pour Azure)
# ══════════════════════════════════════════════════════════════════════════════

# terraform {
#   backend "azurerm" {
#     resource_group_name  = "terraform-state-rg"
#     storage_account_name = "tfstateprod"
#     container_name       = "tfstate"
#     key                  = "devops-portfolio.prod.tfstate"
#   }
# }

# ══════════════════════════════════════════════════════════════════════════════
# ⚠️ IMPORTANT - PRODUCTION
# ══════════════════════════════════════════════════════════════════════════════

# EN PRODUCTION :
# 1. Toujours utiliser un backend distant
# 2. Activer le chiffrement du state
# 3. Activer le state locking (DynamoDB pour S3)
# 4. Configurer des backups automatiques
# 5. Limiter les accès avec IAM/RBAC
# 6. Utiliser un workspace dédié
# 7. Ne jamais commiter terraform.tfstate
