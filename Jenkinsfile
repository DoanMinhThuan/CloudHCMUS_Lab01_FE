pipeline {
    agent any
    
    // --- PHẦN BẮT BUỘC PHẢI CÓ ---
    environment {
        // Tên image của bạn trên DockerHub
        DOCKER_IMAGE = 'dhuuthuc/lab01-fe' 
        
        // ID này phải khớp CHÍNH XÁC với ID trong ảnh image_5ad627.png của bạn
        DOCKER_CRED_ID = 'dockerhub-login'
    }
    // -----------------------------

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker') {
            steps {
                script {
                    echo '--- Building Docker Image ---'
                    // Build image
                    docker.build("${DOCKER_IMAGE}:${BUILD_NUMBER}")
                    docker.build("${DOCKER_IMAGE}:latest")
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    echo '--- Pushing to DockerHub ---'
                    // Đăng nhập và Push
                    // Lỗi xảy ra ở dòng dưới nếu thiếu phần environment ở trên
                    docker.withRegistry('', DOCKER_CRED_ID) {
                        docker.image("${DOCKER_IMAGE}:${BUILD_NUMBER}").push()
                        docker.image("${DOCKER_IMAGE}:latest").push()
                    }
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                // Xóa image local để tiết kiệm dung lượng
                sh "docker rmi ${DOCKER_IMAGE}:${BUILD_NUMBER} || true"
                sh "docker rmi ${DOCKER_IMAGE}:latest || true"
            }
        }
    }
}
