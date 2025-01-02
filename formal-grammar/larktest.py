from lark import Lark, Transformer, v_args

# Define the grammar in EBNF format
grammar = r"""
start: block+

block: "@begin{" block_name "}" clause* "@end{" block_name "}"

clause: hash_level title content? subclause*

subclause: hash_level title content? subclause*

content: (text | reference | inline_command)+

reference: "{{" reference_name "}}"

inline_command: "@" command_name "{" command_parameters "}"

title: text

hash_level: "#" | "##" | "###" | "####"

command_parameters: ESCAPED_STRING ("," ESCAPED_STRING)*

block_name: identifier

reference_name: identifier

command_name: identifier

identifier: /[a-zA-Z0-9 _'-]+/

text: /[^\{\}@]+/

%import common.ESCAPED_STRING
%import common.WS
%ignore WS
"""

# Create the parser
parser = Lark(grammar, start="start", parser="lalr")

# Define a test input
test_input = """
@begin{GeneralConditions}
# No guarantee of work or exclusivity
The {{Contract Authority}} is not, by executing this {{MICTA}}:
## bound to issue any {{Order Proposal}} to the {{Supplier}};
## bound to engage the {{Supplier}} to supply any goods, services and/or other activities or to enter into any {{Contract}}; or
## restricted in any way from engaging any other person to supply any goods, services and/or other activities:
### of any type, including goods, services and/or other activities that are the same as or similar to any {{Supplier's Activities}} or {{ICT Activities}}; or
### at any location where, or in respect of any project that, the {{Supplier}} may be required to supply goods, services and/or other activities.
@end{GeneralConditions}
"""

# Parse the test input and print the result
try:
    parse_tree = parser.parse(test_input)
    print(parse_tree.pretty())  # Display the parse tree
except Exception as e:
    print(str(e))  # Show any parsing errors

