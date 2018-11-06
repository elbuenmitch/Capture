#!/Users/danielcardona/miniconda2/bin/python2.7
import sys

def testFunctionParam(text):
    return "hello "+str(text)

def testFunction():
    return "hello from Python!"

if __name__ == "__main__":
    print testFunctionParam(sys.argv[1])
    print testFunctionParam(sys.argv[0])
    print testFunctionParam(sys.argv[2])