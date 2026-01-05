pipeline {
    agent any

    environment {
        // --- CẤU HÌNH ---
        DOCKER_IMAGE = '22120359/lab03-fe'
        DOCKER_CRED_ID = 'dockerhub-id'
        APP_SERVER_IP = '172.31.45.223' 
        SSH_CRED_ID = 'lab-master-key'
    }

    stages {
        // Giai đoạn 1: Lấy code từ GitHub về
        stage('Checkout Code') {
            steps {
                checkout scm
                echo '--- Checkout Done ---'
            }
        }

        // Giai đoạn 2: Đóng gói thành Docker Image
        stage('Build Docker Image') {
            steps {
                script {
                    echo '--- Building Docker Image ---'
                    // Build image và gắn tag là số lần chạy (Build Number) để dễ quản lý version
                    sh 'docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .'
                    // Build thêm tag latest
                    sh 'docker build -t ${DOCKER_IMAGE}:latest .'
                }
            }
        }

        // Giai đoạn 3: Đẩy lên DockerHub
        stage('Push to DockerHub') {
            steps {
                script {
                    echo '--- Pushing to DockerHub ---'
                    // Đăng nhập an toàn bằng Credential đã cấu hình
                    withCredentials([usernamePassword(credentialsId: DOCKER_CRED_ID, usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'
                        sh 'docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}'
                        sh 'docker push ${DOCKER_IMAGE}:latest'
                    }
                }
            }
        }

        stage('Deploy to App Server') {
            steps {
                // Dùng plugin sshagent để nạp key vào phiên làm việc
                sshagent(credentials: [SSH_CRED_ID]) {
                    script {
                        echo "--- Đang Deploy lên Server: ${APP_SERVER_IP} ---"
                        // Các lệnh này sẽ chạy từ xa trên máy App Server
                        // StrictHostKeyChecking=no để tránh hỏi Yes/No khi lần đầu kết nối
                        sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@${APP_SERVER_IP} '
                                docker pull ${DOCKER_IMAGE}:latest
                                docker stop my-app || true
                                docker rm my-app || true
                                docker run -d --name my-app -p 8080:8080 ${DOCKER_IMAGE}:latest
                            '
                        """
                    }
                }
            }
        }
    }
    
    // Dọn dẹp sau khi chạy xong
    post {
        always {
            sh 'docker logout'
            sh 'docker rmi ${DOCKER_IMAGE}:${BUILD_NUMBER} || true'
            sh 'docker rmi ${DOCKER_IMAGE}:latest || true'
        }
    }
}