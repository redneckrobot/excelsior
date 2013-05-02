#Script File used by travis to mark when a build was preformed.

if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
cd $HOME
git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis-CI"

git clone --quiet --branch=${TRAVIS_BRANCH} https://${GH_TOKEN}@github.com/nys-its/excelsior.git  ${TRAVIS_BRANCH} > /dev/null

cd ${TRAVIS_BRANCH}

echo "Travis Build " >> .lastBuild
echo date >> .lastBuild

#git add -f .
#git commit -m "TRAVIS BUILD $TRAVIS_BUILD_NUMBER"
#git push -fq origin ${TRAVIS_BRANCH} > /dev/null

echo -e "Travis is done"

fi