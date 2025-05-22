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
        /* stage('bastion login') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-key', variable: 'AWS_SECRET_ACCESS_KEY'),
                    usernamePassword(credentialsId: 'ssh-auth', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')
                ]) {
                    sh """
                        sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USERNAME@$EC2_HOST bash -s <<EOF
                        echo "Logged in to EC2 successfully!"

                        # Export AWS credentials for this session
                        export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
                        export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
                        export AWS_DEFAULT_REGION=us-east-1

                        # AWS operations
                        aws sts get-caller-identity
                        aws eks update-kubeconfig --region us-east-1 --name expense-dev
                        kubectl get nodes
                        
EOF
"""
                }
            }
        } */

        stage('Configure AWS on Bastion') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-key', variable: 'AWS_SECRET_ACCESS_KEY'),
                    usernamePassword(credentialsId: 'ssh-auth', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')
                ]) {
                    sh '''
                        sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USERNAME@$EC2_HOST bash -s <<'EOF'
                        echo "Logged in to EC2 successfully"

                        mkdir -p ~/.aws

                        cat > ~/.aws/credentials <<EOL
                        [default]
                        aws_access_key_id = ${AWS_ACCESS_KEY_ID}
                        aws_secret_access_key = ${AWS_SECRET_ACCESS_KEY}
                        EOL

                        cat > ~/.aws/config <<EOL
                        [default]
                        region = us-east-1
                        output = json
                        EOL

                        aws sts get-caller-identity
                        aws eks update-kubeconfig --region us-east-1 --name expense-dev
                        kubectl get nodes
EOF
                    '''
                }
            }
        }
            stage('Configure schema') {
                    steps {
                            withCredentials([
                                string(credentialsId: 'aws-access-key', variable: 'AWS_ACCESS_KEY_ID'),
                                string(credentialsId: 'aws-secret-key', variable: 'AWS_SECRET_ACCESS_KEY'),
                                usernamePassword(credentialsId: 'ssh-auth', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')
                            ]) {
                                sh '''
                                    sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USERNAME@$EC2_HOST bash -s <<'EOF'
                                    echo "Logged in to EC2 successfully!"
                                    mysql -h expense-dev.somisettibhavya.life -u root -pExpenseApp1
                                    USE transactions;
                                    CREATE TABLE IF NOT EXISTS transactions (id INT AUTO_INCREMENT PRIMARY KEY,amount INT,description VARCHAR(255));
                                    CREATE USER IF NOT EXISTS 'expense'@'%' IDENTIFIED BY 'ExpenseApp@1';
                                    GRANT ALL ON transactions.* TO 'expense'@'%';
                                    FLUSH PRIVILEGES;
                                    mysql -h mysql-dev.somisettibhavya.life -u expense -pExpenseApp@1
EOF
                                '''
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