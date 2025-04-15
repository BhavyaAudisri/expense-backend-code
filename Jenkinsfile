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
        region = 'us-east-1'
        project = 'expense'
        environment = 'dev'
        component = 'backend'
        account_id = '124355635734'
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
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage ('Docker build'){
            steps {
                withAWS(region:'us-east-1', credentials :'AWS-CREDS') {
                sh """
                aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin 124355635734.dkr.ecr.us-east-1.amazonaws.com
                sudo docker build -t ${account_id}.dkr.ecr.us-east-1.amazonaws.com/${project}/${environment}/${component}:${appVersion} .
                sudo docker images
                sudo docker push ${account_id}.dkr.ecr.us-east-1.amazonaws.com/expense/dev/backend:${appVersion}
                """
            }
            }
        }
                
        stage('Test') {
            steps {
                sh 'echo this is Test'
            }
        }
        stage('Deploy') {
            
            steps {
                withAWS(region:'us-east-1', credentials :'AWS-CREDS') {
                sh """
                    aws eks update-kubeconfig --region ${region} --name ${project}-${environment}
                    cd helm
                    sed -i 's/IMAGE_VERSION/${appVersion}/g' values-${environment}.yaml
                    helm upgrade --install ${component} -n ${project} -f values-${environment}.yaml .
                """
            }
        }
        }
        stage('scan') {
            steps {
                sh 'echo this is scan'
            }
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