terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "ap-southeast-1" # Region Singapore
}

# 1. Tạo Security Group cho App Server (Mở SSH và Port 8080)
resource "aws_security_group" "app_sg_auto" {
  name        = "app_sg_auto_terraform_v2"
  description = "Allow SSH and Port 8080"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 2. Tìm AMI Ubuntu 22.04 mới nhất
data "aws_ami" "ubuntu" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  owners = ["099720109477"] # Canonical
}

# 3. Tạo máy chủ App Server
resource "aws_instance" "app_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.medium" # Dùng t3.medium cho nhanh (hoặc t2.micro nếu muốn free)
  key_name      = "lab-master-key" # TÊN KEY CỦA BẠN TRÊN AWS (Phải chính xác)
  
  vpc_security_group_ids = [aws_security_group.app_sg_auto.id]

  tags = {
    Name = "App-Server-Auto-Terraform"
  }
}

# 4. Xuất ra IP để Ansible dùng
output "instance_ip" {
  value = aws_instance.app_server.public_ip
}
