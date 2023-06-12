import { ESLintUtils } from "@typescript-eslint/utils";
import { type ObjectExpression } from "@typescript-eslint/types/dist/generated/ast-spec";
import ts from "typescript";
import * as tsutils from "tsutils";

export const loggerRules = ESLintUtils.RuleCreator.withoutDocs({
  create(context) {
    const propertiesToCheck = context.options[0]
      ? new Set(context.options[0])
      : new Set(["logger"]);

    return {
      CallExpression(node) {
        // Check usage of logger.xxx()
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.object.type === "Identifier" &&
          propertiesToCheck.has(node.callee.object.name)
        ) {
          const loggerData = node.arguments.find(
            (arg) => arg.type === "ObjectExpression",
          ) as ObjectExpression;

          if (loggerData) {
            const objectProperties = loggerData.properties;
            const parserServices = ESLintUtils.getParserServices(context);
            const checker = parserServices.program.getTypeChecker();

            objectProperties.forEach((property) => {
              const tsNode = parserServices.esTreeNodeToTSNodeMap.get(property);
              const tsNodeType = checker.getTypeAtLocation(tsNode);

              // check if value is a shorthand (e.g. {myObject} )
              if (
                property.type === "Property" &&
                property.shorthand &&
                property.value.type === "Identifier"
              ) {
                // no objects
                if (
                  tsutils.isObjectType(tsNodeType) ||
                  tsutils.isGenericType(tsNodeType) ||
                  tsutils.isInterfaceType(tsNodeType) ||
                  tsutils.isSpreadElement(tsNode) ||
                  tsutils.isClassExpression(tsNode) ||
                  tsutils.isClassDeclaration(tsNode) ||
                  tsutils.isEmptyObjectType(tsNodeType)
                ) {
                  context.report({
                    node: property,
                    messageId: "noShorthand",
                  });
                }

                // no arrays
                if (tsutils.isArrayTypeNode(tsNode)) {
                  context.report({
                    node: property,
                    messageId: "noArray",
                  });
                }

                // no unknown values
                if (
                  tsutils.isTypeFlagSet(tsNodeType, ts.TypeFlags.Any) ||
                  tsutils.isTypeFlagSet(tsNodeType, ts.TypeFlags.Unknown) ||
                  tsutils.isGenericType(tsNodeType)
                ) {
                  context.report({
                    node: property,
                    messageId: "noUnknowns",
                  });
                }
              }
            });
          }
        }
      },
    };
  },
  meta: {
    type: "problem",
    docs: {
      description: "Invalid logs usage - object shorthand property",
      recommended: "error",
      suggestion: false,
      requiresTypeChecking: true,
    },
    messages: {
      noShorthand:
        "Potential PII leak: object shorthand property used with object value inside logger arguments. Pass only specific fields from the object to the logger.",
      noArray:
        "Potential PII leak: object shorthand property used with array value inside logger arguments. Please use `redactLogArray` method.",
      noUnknowns:
        "Potential PII leak: object shorthand property used with unknown value inside logger arguments. Please use only known values.",
    },
    schema: [
      {
        type: "array",
        items: {
          type: "string",
          title: "Override logger names to check",
          examples: ["myLogger", "customLogger"],
          default: ["logger"],
        },
      },
    ],
  },
  defaultOptions: [],
});
