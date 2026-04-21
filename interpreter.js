const fs = require("fs");

const filename = process.argv[2];

if (!filename) {
    console.log("Usage: node interpreter.js program.txt");
    process.exit(1);
}

let fullProgram = "";

const grammar = {
  statement: ["variable_declaration", "quack_statement"],

  variable_declaration: [
    "KEYWORD(let)",
    "IDENTIFIER",
    "EQUALS",
    "NUMBER",
    "SEMICOLON"
  ],

  quack_statement: [
    "KEYWORD(quack)",
    "LPAREN",
    "IDENTIFIER",
    "RPAREN",
    "SEMICOLON"
  ]
};

//should start EMPTY, then populated with lexer
const tokens = [
  { type: "KEYWORD", value: "let" },
  { type: "IDENTIFIER", value: "Qx" },
  { type: "EQUALS", value: "=" },
  { type: "NUMBER", value: 2 },
  { type: "SEMICOLON", value: ";" },

  { type: "KEYWORD", value: "quack" },
  { type: "LPAREN", value: "(" },
  { type: "IDENTIFIER", value: "Qx" },
  { type: "RPAREN", value: ")" },
  { type: "SEMICOLON", value: ";" }
];

function readProgram() {
    const program = fs.readFileSync(filename, "utf8");

    const lines = program.split("\n");

    let fullProg = "";

    for (let line of lines) {
        fullProg += line + "\n";
    }

    //console.log(fullProgram);
    return fullProg;
}

function lexer(fullProgram) {
    // will return list of tokens
}

function parse(tokens) {
  let current = 0;

  let ast = {
    type: "Program",
    body: []
  };

  while (current < tokens.length) {
    let token = tokens[current];

    // Check for variable declaration grammar:
    // let IDENTIFIER = NUMBER ;
    if (
      current + 4 < tokens.length &&
      tokens[current].type === "KEYWORD" &&
      tokens[current].value === "let" &&
      tokens[current + 1].type === "IDENTIFIER" &&
      tokens[current + 2].type === "EQUALS" &&
      tokens[current + 3].type === "NUMBER" &&
      tokens[current + 4].type === "SEMICOLON"
    ) {
      ast.body.push({
        type: "VariableDeclaration",
        name: tokens[current + 1].value,
        value: {
          type: "NumberLiteral",
          value: tokens[current + 3].value
        }
      });

      current = current + 5;
    }

    // Check for quack statement grammar:
    // quack ( IDENTIFIER ) ;
    else if (
      current + 4 < tokens.length &&
      tokens[current].type === "KEYWORD" &&
      tokens[current].value === "quack" &&
      tokens[current + 1].type === "LPAREN" &&
      tokens[current + 2].type === "IDENTIFIER" &&
      tokens[current + 3].type === "RPAREN" &&
      tokens[current + 4].type === "SEMICOLON"
    ) {
      ast.body.push({
        type: "QuackStatement",
        argument: {
          type: "Identifier",
          name: tokens[current + 2].value
        }
      });

      current = current + 5;
    }

    // If it matches nothing, it is invalid
    else {
      throw new Error("Syntax error near token " + current);
    }
  }

  return ast;
}

function interpreter(ast) {

}

//RUN MAIN PROGRAM

fullProgram = readProgram()
//tokens = lexer(fullProgram)
const ast = parse(tokens);
console.log(JSON.stringify(ast, null, 2));
//interpreter(ast)

