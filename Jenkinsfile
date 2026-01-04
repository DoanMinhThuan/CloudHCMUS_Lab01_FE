pipeline {
    agent any

    environment {
        // --- CẤU HÌNH DOCKER ---
        DOCKER_IMAGE = 'dhuuthuc/lab01-fe'
        DOCKER_CRED_ID = 'dockerhub-id'

        // --- CẤU HÌNH AWS & SSH (Vừa tạo ở trên) ---
        AWS_CRED_ID = 'aws-credentials'
        SSH_CRED_ID = 'lab-ssh-key'
    }

    stages {
        // GIAI ĐOẠN 1: CI - BUILD CODE
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build & Push Docker') {
            steps {
                script {
                    echo '--- 1. Building Docker Image ---'
                    docker.build("${DOCKER_IMAGE}:${BUILD_NUMBER}")
                    docker.build("${DOCKER_IMAGE}:latest")

                    echo '--- 2. Pushing to DockerHub ---'
                    docker.withRegistry('', DOCKER_CRED_ID) {
                        docker.image("${DOCKER_IMAGE}:${BUILD_NUMBER}").push()
                        docker.image("${DOCKER_IMAGE}:latest").push()
                    }
                }
            }
        }

        // GIAI ĐOẠN 2: CD - TẠO HẠ TẦNG (TERRAFORM)
        stage('Provision Server (Terraform)') {
            steps {
                // Nạp Access Key AWS vào biến môi trường để Terraform dùng
                withCredentials([usernamePassword(credentialsId: AWS_CRED_ID, usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    dir('infrastructure') {
                        echo '--- 3. Terraform Init & Apply ---'
                        sh 'terraform init'
                        // Chạy Apply tự động, không cần hỏi yes/no
                        sh 'terraform apply -auto-approve'
                        // Xuất IP của server mới ra file text
                        sh 'terraform output -raw instance_ip > app_ip.txt'
                    }
                }
            }
        }

        // GIAI ĐOẠN 3: CD - CÀI ĐẶT ỨNG DỤNG (ANSIBLE)
        stage('Deploy App (Ansible)') {
            steps {
                dir('infrastructure') {
                    script {
                        // Lấy IP vừa tạo
                        def APP_IP = readFile('app_ip.txt').trim()
                        echo "--- Deploying to IP: ${APP_IP} ---"
                        
                        // Tạo file danh sách máy chủ cho Ansible
                        sh "echo '${APP_IP} ansible_user=ubuntu' > inventory.ini"
                    }

                    // Nạp SSH Key để Ansible kết nối vào server
                    sshagent([SSH_CRED_ID]) {
                        echo '--- 4. Running Ansible Playbook ---'
                        // Chạy playbook cài Docker và chạy App
                        sh 'ansible-playbook -i inventory.ini deploy.yml'
                    }
                }
            }
        }
    }
}
