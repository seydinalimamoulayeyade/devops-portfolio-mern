# environments/dev/backend.tf
# Configuration du backend pour l'environnement DEV
# Par défaut: local state

# Pour activer un backend distant, décommentez et configurez:

# terraform {
#   backend "s3" {
#     bucket         = "my-terraform-state"
#     key            = "devops-portfolio/dev/terraform.tfstate"
#     region         = "us-east-1"
#     encrypt        = true
#     dynamodb_table = "terraform-state-lock-dev"
#   }
# }

# Ou Terraform Cloud:
# terraform {
#   cloud {
#     organization = "mon-organisation"
#     workspaces {
#       name = "devops-portfolio-dev"
#     }
#   }
# }
