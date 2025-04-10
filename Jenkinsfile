pipeline{
    agent {
            label 'agent-1'
    }
    options {
        timeout(time: 10, unit: 'MINUTES')
        disableConcurrentBuilds()
    }
    environment {
        DEBUG = 'true'
        appVersion = '' //this will become global, we can use across pipeline
    }
    
    stages {
        stage ('read the version'){
            steps {
                script {
                    def packageJson = readJSON file:'package.json'
                    appVersion = packageJson.version
                    echo "AppVersion : ${appVersion}"
                }
            }
        }
        stage ('Docker build'){
            steps {
                sh """
                docker build -t bhavyasomisetti/backend:${appVersion}
                docker images
                """
            }
        }
        stage('Build') {
            steps {
                sh 'echo this is build'
            }
        }
        stage('Test') {
            steps {
                sh 'echo this is Test'
            }
        }
        stage('Deploy') {
             when {
                //branch 'production'
                 expression { env.GIT_BRANCH == "origin/main" }
            }
            steps {
                sh 'echo this is deploy'
            }
        }
        stage('scan') {
            steps {
                sh 'echo this is scan'
            }
        }
        
    }
    post {
        always {
            echo " this section runs always"
            deleteDir()
        }
        success {
            echo " this section run when pipeline is success"
        }
        failure {
            echo " this section run when pipeline is failure"
        }
    }
}