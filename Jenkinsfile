pipeline {
    agent { label 'docker-agent' }

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(
            numToKeepStr: '10',
            artifactNumToKeepStr: '5'
        ))
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    environment {
        IMAGE_REPO = 'tharushi22497794/isec6000-assessment2'
    }

    stages {
        stage('Checkout') {
            steps {
                // Remove previous reports and dependencies before checkout.
                deleteDir()
                checkout scm
                script {
                    env.IMAGE_TAG = "${env.BUILD_NUMBER}-" +
                        sh(script: 'git rev-parse --short HEAD',
                           returnStdout: true).trim()
                }
                sh 'mkdir -p reports'
            }
        }

        stage('Node 16 checks') {
            agent {
                docker {
                    image 'node:16.20.2-bookworm-slim'
                    reuseNode true
                    args '-u 1000:1000 -e npm_config_cache=/tmp/npm-cache'
                }
            }

            stages {
                stage('Install dependencies') {
                    steps {
                        sh 'node --version && npm --version'
                        sh 'npm ci --engine-strict --no-audit'
                    }
                }

                stage('Tests') {
                    steps {
                        sh '''
                            npm test -- --ci --coverage \
                              --json --outputFile=reports/tests.json
                        '''
                    }
                }

                stage('Dependency security scan') {
                    steps {
                        // A non-zero exit stops image build and publication.
                        sh 'npm audit --audit-level=high --json > reports/npm-audit.json'
                    }
                }
            }
        }

        stage('Build image') {
            steps {
                sh 'docker build -t "$IMAGE_REPO:$IMAGE_TAG" .'
                sh '''
                    docker image inspect "$IMAGE_REPO:$IMAGE_TAG" \
                      > reports/image-inspect.json
                    printf '%s\\n' "$IMAGE_REPO:$IMAGE_TAG" \
                      > reports/image-reference.txt
                '''
            }
        }

        stage('Push image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-assessment2',
                    usernameVariable: 'DOCKERHUB_USER',
                    passwordVariable: 'DOCKERHUB_TOKEN'
                )]) {
                    sh '''
                        set +x
                        export DOCKER_CONFIG="$(mktemp -d)"
                        trap 'rm -rf "$DOCKER_CONFIG"' EXIT

                        printf '%s' "$DOCKERHUB_TOKEN" |
                          docker login --username "$DOCKERHUB_USER" \
                            --password-stdin

                        docker push "$IMAGE_REPO:$IMAGE_TAG"
                        docker tag "$IMAGE_REPO:$IMAGE_TAG" "$IMAGE_REPO:latest"
                        docker push "$IMAGE_REPO:latest"
                    '''
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts(
                artifacts: 'reports/**,coverage/**',
                allowEmptyArchive: true,
                fingerprint: true
            )
        }
        success {
            echo 'Checks passed and application image published.'
        }
        failure {
            echo 'Pipeline failed. Review the failed stage and archived reports.'
        }
    }
}
