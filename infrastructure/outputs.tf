# Xuất IP ra màn hình để xem
output "jenkins_ip" { value = aws_instance.jenkins.public_ip }
output "nginx_ip"   { value = aws_instance.nginx.public_ip }
output "app_ip"     { value = aws_instance.app_server.public_ip }

# Tự động tạo file inventory.ini
resource "local_file" "ansible_inventory" {
  content = <<EOT
[jenkins]
${aws_instance.jenkins.public_ip} ansible_user=ubuntu ansible_ssh_common_args='-o StrictHostKeyChecking=no'

[nginx]
${aws_instance.nginx.public_ip} ansible_user=ubuntu ansible_ssh_common_args='-o StrictHostKeyChecking=no'

[app_server]
${aws_instance.app_server.public_ip} ansible_user=ubuntu ansible_ssh_common_args='-o StrictHostKeyChecking=no'
EOT
  filename = "${path.module}/inventory.ini"
}