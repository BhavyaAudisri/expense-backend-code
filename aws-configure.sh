#!/bin/bash

# Usage: ./configure_aws_on_bastion.sh <bastion_user> <bastion_host> <aws_access_key> <aws_secret_key> <aws_region>

BASTION_USER=$1
BASTION_HOST=$2
AWS_ACCESS_KEY=$3
AWS_SECRET_KEY=$4
AWS_REGION=$5

ssh -o StrictHostKeyChecking=no ${BASTION_USER}@${BASTION_HOST} << EOF
  mkdir -p ~/.aws

  cat > ~/.aws/credentials << CREDENTIALS
[default]
aws_access_key_id=${AWS_ACCESS_KEY}
aws_secret_access_key=${AWS_SECRET_KEY}
CREDENTIALS

  cat > ~/.aws/config << CONFIG
[default]
region=${AWS_REGION}
output=json
CONFIG

  echo "AWS CLI configured on bastion host ${BASTION_HOST}"
EOF
