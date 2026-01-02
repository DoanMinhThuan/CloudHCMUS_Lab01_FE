pipeline {
    agent any
    environment {
        // --- QUAN TRỌNG: Sửa dòng dưới thành tên DockerHub của bạn ---
        // Ví dụ: thucdo08/lab01-fe
        DOCKER_IMAGE = 'dhuuthuc/lab01-fe' 
        
        // Cái này giữ nguyên vì nãy bạn đặt ID là dockerhub-login rồi
        DOCKER_CRED_ID = 'dockerhub-login'
    }
    stages {
        stage('Checkout Code') {
            steps {
                // Lấy code từ GitHub về
                checkout scm
            }
        }
        stage('Build Docker') {
            steps {
                script {
                    // Build ra image
                    sh "docker build -t $DOCKER_IMAGE:${env.BUILD_NUMBER} ."
                }
            }
        }
        stage('Push to DockerHub') {
            steps {
                script {
                    // Đăng nhập và đẩy lên
                    withCredentials([usernamePassword(credentialsId: DOCKER_CRED_ID, passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                        sh "echo $PASS | docker login -u $USER --password-stdin"
                        sh "docker push $DOCKER_IMAGE:${env.BUILD_NUMBER}"
                        
                        // Gắn mác 'latest' cho bản mới nhất
                        sh "docker tag $DOCKER_IMAGE:${env.BUILD_NUMBER} $DOCKER_IMAGE:latest"
                        sh "docker push $DOCKER_IMAGE:latest"
                    }
                }
            }
        }
        stage('Cleanup') {
            steps {
                // Dọn dẹp rác sau khi build để server không bị đầy
                sh "docker rmi $DOCKER_IMAGE:${env.BUILD_NUMBER}"
                sh "docker rmi $DOCKER_IMAGE:latest"
            }
        }
        // Thêm đoạn này vào cuối pipeline
    post {
        success {
            echo 'Frontend build success. Triggering Deploy CD...'
            // Thay 'Lab01-Deploy-CD' bằng tên chính xác của Job CD trong Jenkins của bạn
            build job: 'Lab01-Deploy-CD', wait: false
        }
    }
}




