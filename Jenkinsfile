pipeline{
    agent {
            label 'AGENT-1'
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
        EC2_HOST = "expense-bastion.somisettibhavya.life" // e.g., ec2-34-201-XXX-XXX.compute-1.amazonaws.com
    }
    parameters{
        booleanParam(name: 'deploy', defaultValue: false, description: 'Toggle this value')
    }
     
    stages {
        stage ('bastion login'){
            steps {
                withCredentials([usernamePassword(credentialsId: 'ssh-auth', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh """
                            sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USERNAME@$EC2_HOST 
                            echo "Logged in to EC2 successfully!"
                        """
                    }
            }
        }
        
        
        stage ('update EKS'){
            steps {
                 withAWS(region:'us-east-1', credentials :'AWS-CREDS') {
                        sh """
                           aws eks update-kubeconfig --region us-east-1 --name expense-dev
                           kubectl get nodes
                        """
                    }
            }
        }

        stage ('update Schema'){
            steps {
                 withAWS(region:'us-east-1', credentials :'AWS-CREDS') {
                        sh """
                           sh database.sh
                        """
                    }
            }
        }

        /* stage ('read the version'){
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
                        docker build -t ${account_id}.dkr.ecr.us-east-1.amazonaws.com/${project}/${environment}/${component}:${appVersion} .
                        docker images
                        docker push ${account_id}.dkr.ecr.us-east-1.amazonaws.com/${project}/${environment}/${component}:${appVersion}
                    """
            }
            }
        }
                
        stage('Test') {
            steps {
                sh 'echo this is Test'
            }
        }
        stage('Trigger Deploy'){
            when { 
                expression { params.deploy }
            }
            steps{
                build job: 'backend-cd', parameters: [string(name: 'version', value: "${appVersion}")], wait: true
            }
        }
        stage('scan') {
            steps {
                sh 'echo this is scan'
            }
        } */
        
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