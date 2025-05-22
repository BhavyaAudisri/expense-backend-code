#!/bin/bash
### Install Drivers

* Add the EKS chart repo to Helm
```
helm repo add eks https://aws.github.io/eks-charts
```

* Install AWS Load Balancer Controller
```
helm install aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system --set clusterName=$CLUSTER_NAME --set serviceAccount.create=true --set serviceAccount.name=aws-load-balancer-controller