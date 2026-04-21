import sys
import json

filename = sys.argv[1] #democode.pud

full_program = ""

grammar = {
    "statement": ["variable_declaration", "quack_statement"],

    "variable_declaration": [
        "KEYWORD(let)",
        "IDENTIFIER",
        "EQUALS",
        "NUMBER",
        "SEMICOLON"
    ],

    "quack_statement": [
        "KEYWORD(quack)",
        "LPAREN",
        "IDENTIFIER",
        "RPAREN",
        "SEMICOLON"
    ]
}

#should start EMPTY, then populated with lexer
tokens = [
    {"type": "KEYWORD", "value": "let"},
    {"type": "IDENTIFIER", "value": "Qx"},
    {"type": "EQUALS", "value": "="},
    {"type": "NUMBER", "value": 2},
    {"type": "SEMICOLON", "value": ";"},

    {"type": "KEYWORD", "value": "quack"},
    {"type": "LPAREN", "value": "("},
    {"type": "IDENTIFIER", "value": "Qx"},
    {"type": "RPAREN", "value": ")"},
    {"type": "SEMICOLON", "value": ";"}
]

def readProgram():
    full_prog = ""
    with open(filename, "r") as file:
        for line in file:
            full_prog += line  # line already includes '\n'
    return full_prog
    #print(full_program)

def lexer(full_program):
    # will return list of tokens
    pass

def parse(tokens):
    current = 0

    ast = {
        "type": "Program",
        "body": []
    }

    while current < len(tokens):
        token = tokens[current]

        # Check for variable declaration grammar:
        # let IDENTIFIER = NUMBER ;
        if (
            current + 4 < len(tokens) and
            tokens[current]["type"] == "KEYWORD" and
            tokens[current]["value"] == "let" and
            tokens[current + 1]["type"] == "IDENTIFIER" and
            tokens[current + 2]["type"] == "EQUALS" and
            tokens[current + 3]["type"] == "NUMBER" and
            tokens[current + 4]["type"] == "SEMICOLON"
        ):
            ast["body"].append({
                "type": "VariableDeclaration",
                "name": tokens[current + 1]["value"],
                "value": {
                    "type": "NumberLiteral",
                    "value": tokens[current + 3]["value"]
                }
            })

            current = current + 5

        # Check for quack statement grammar:
        # quack ( IDENTIFIER ) ;
        elif (
            current + 4 < len(tokens) and
            tokens[current]["type"] == "KEYWORD" and
            tokens[current]["value"] == "quack" and
            tokens[current + 1]["type"] == "LPAREN" and
            tokens[current + 2]["type"] == "IDENTIFIER" and
            tokens[current + 3]["type"] == "RPAREN" and
            tokens[current + 4]["type"] == "SEMICOLON"
        ):
            ast["body"].append({
                "type": "QuackStatement",
                "argument": {
                    "type": "Identifier",
                    "name": tokens[current + 2]["value"]
                }
            })

            current = current + 5

        # If it matches nothing, it is invalid
        else:
            raise ValueError("Syntax error near token " + str(current))

    return ast

def interpreter(ast):
    #will print OUTPUT to console
    pass

if __name__ == "__main__":
    full_program = readProgram()
    #tokens = lexer(full_program)
    ast = parse(tokens)
    print(json.dumps(ast, indent=2))
    #interpreter(ast)