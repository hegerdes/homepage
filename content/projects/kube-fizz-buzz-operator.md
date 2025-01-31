+++
title = "Fizz-Buzz in Kubernetes | Go"
description = "Run Fizz-Buzz as declarative Kubernetes recourses"
[taxonomies]
categories=[]
tags = []

[extra]
pic = "/img/blog/fizzbuzz.webp"
pic_alt="Comic style picture of monitors and rabic kube with fizz-buzz"
link_source="https://github.com/hegerdes/fizz-buzz-operator"

+++
A Kubernetes Operator written in Go that implements Fizz-Buzz in a declarative way. Create a `instance.fizz-buzz.hegerdes.com` resource and watch you pods get created following the fizz-buzz rules.  
The operator was created using the [operator-sdk](https://github.com/operator-framework/operator-sdk) and has a full CI setup for testing and releases.
