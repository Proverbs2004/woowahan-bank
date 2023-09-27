pipeline {
    agent any

    environment {
        DOCKER_CREDENTIAL_ID = 'dockerhub-at'
        NODE_VERSION = '16'
        NPM_VERSION = '8'
        NVM_DIR = "/var/jenkins_home/.nvm"
        JAVA_HOME = "/var/jenkins_home/zulu11"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Push Frontend') {
            steps {
                dir('frontend') {
                    script {
                        sh """
                            . $NVM_DIR/nvm.sh
                            nvm install $NODE_VERSION
                            nvm use $NODE_VERSION
                            npm install -g npm@$NPM_VERSION
                        """
                        sh 'npm install'
                        sh 'npm run build'
                        withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIAL_ID, usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                            sh "docker login -u $DOCKER_HUB_USERNAME -p $DOCKER_HUB_PASSWORD"
                        }
                        sh "docker build -t $DOCKER_HUB_USERNAME/frontend:latest ."
                        sh "docker push $DOCKER_HUB_USERNAME/frontend:latest"
                    }
                }
            }
        }

        stage('Build and Push Backend') {
            steps {
                dir('backend') {
                    script {
                        sh './gradlew clean build'
                        withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIAL_ID, usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                            sh "docker login -u $DOCKER_HUB_USERNAME -p $DOCKER_HUB_PASSWORD"
                        }
                        sh "docker build -t $DOCKER_HUB_USERNAME/backend:latest ."
                        sh "docker push $DOCKER_HUB_USERNAME/backend:latest"
                    }
                }
            }
        }

        stage('Update Docker Compose') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIAL_ID, usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                        sh "docker login -u $DOCKER_HUB_USERNAME -p $DOCKER_HUB_PASSWORD"
                    }
                    sh "docker pull $DOCKER_HUB_USERNAME/frontend:latest"
                    sh "docker pull $DOCKER_HUB_USERNAME/backend:latest"
                    sh "docker-compose down"
                    sh "docker-compose up -d"
                }
            }
        }
    }
}
