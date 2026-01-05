variable "aws_region" {
  default = "ap-southeast-1" # Singapore
}

variable "key_name" {
  default = "lab-master-key"
}

variable "instance_type" {
  default = "t3.micro"
}

variable "vpc_id" {
  description = "VPC ID lấy từ AWS Console"
  default     = "vpc-040bd91dfcd3032ce" 
}