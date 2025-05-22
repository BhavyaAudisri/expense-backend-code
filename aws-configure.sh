#!/bin/bash

mkdir -p ~/.aws
            cat > ~/.aws/credentials << EOF
[default]
aws_access_key_id=${AWS_ACCESS_KEY}
aws_secret_access_key=${AWS_SECRET_KEY}
EOF

            cat > ~/.aws/config << EOF
[default]
region=us-east-1
output=json
EOF
            echo "AWS CLI configured on bastion"
ENDSSH
