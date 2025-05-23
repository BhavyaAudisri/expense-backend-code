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
        DB_HOST = "mysql-dev.somisettibhavya.life"
        REGION_CODE = 'us-east-1'
        CLUSTER_NAME = 'expense-dev'
        ACC_ID = '124355635734'
        ARCH = 'amd64'
        PLATFORM = '$(uname -s)_$ARCH'

    }
    parameters{
        booleanParam(name: 'deploy', defaultValue: false, description: 'Toggle this value')
    }
     
    stages {
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
           
        stage('Upload & Run SQL') {
            steps {
                withCredentials([
                     usernamePassword(credentialsId: 'ssh-auth', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')
                    ]) {
                     sh '''
                        echo "Checking if backend.sql exists locally..."
                        ls -lh backend.sql

                        echo "Copying SQL file to Bastion..."
                        sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no backend.sql $USERNAME@$EC2_HOST:/tmp/backend.sql

                        echo "Verifying file on Bastion..."
                        sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USERNAME@$EC2_HOST "ls -lh /tmp/backend.sql"
                        echo "Running SQL script on remote MySQL server from Bastion..."
                        sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USERNAME@$EC2_HOST \\
                        "mysql -h mysql-dev.somisettibhavya.life -u root -pExpenseApp1 transactions < /tmp/backend.sql"
                                    
                    '''
        }
    }
}
        stage('Run Ingress Controller Script on Bastion') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'ssh-auth', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')
                    ]) {
                        sh '''
                            sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USERNAME@$EC2_HOST
                            # Provide access to EKS through IAM Policy
                            eksctl create iamserviceaccount \\
                            --cluster=$CLUSTER_NAME \\
                            --namespace=kube-system \\
                            --name=aws-load-balancer-controller \\
                            --attach-policy-arn=arn:aws:iam::${ACC_ID}:policy/AWSLoadBalancerControllerIAMPolicy \\
                            --override-existing-serviceaccounts \\
                            --region $REGION_CODE \\
                            --approve
                            
                '''
            }
        }
    }
        stage('Install drivers on Bastion') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'ssh-auth', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')
                    ]) {
                        sh '''
                            sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USERNAME@$EC2_HOST
                            helm repo add eks https://aws.github.io/eks-charts
                            helm install aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system --set clusterName=$CLUSTER_NAME --set serviceAccount.create=true --set serviceAccount.name=aws-load-balancer-controller
                            kubectl get pods -n kube-system
                            kubectl create namespace expense
                            
                '''
            }
        }
    }

    

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