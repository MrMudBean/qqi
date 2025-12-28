/** 移除打印狗 */
function removeQqiDogCall(babel: { types: any }) {
  const { types: t } = babel;
  // 允许的值列表
  const ALLOWED_VALUES = ['all', 'error', 'info', 'warn'];
  return {
    name: 'remove-qqi-dog-calls',
    visitor: {
      CallExpression(path: {
        get: (arg0: string) => any;
        remove: () => void;
        scope: { getBinding: (arg0: any) => any };
      }) {
        /**  执行方法  */
        const callee = path.get('callee');

        if (
          t.isMemberExpression(callee.node) &&
          t.isIdentifier(callee.node.object, { name: 'dog' }) &&
          (t.isIdentifier(callee.node.property, { name: 'info' }) ||
            t.isIdentifier(callee.node.property, { name: 'warn' }) ||
            t.isIdentifier(callee.node.property, { name: 'error' }))
        ) {
          path.remove();
        }
        // 处理调用的 dog()
        else if (t.isIdentifier(callee.node)) {
          const binding = path.scope.getBinding(callee.node.name);
          if (
            binding &&
            ['import', 'module'].some(e => binding?.kind === e) &&
            (binding?.path?.parent?.source?.value?.endsWith('/dog') ||
              binding?.path?.parent?.source?.value === 'dog' ||
              binding?.path?.parent?.source?.value === '@dog') &&
            binding?.identifier?.name === 'dog'
          ) {
            path.remove();
          }
        }
      },
      AssignmentExpression(path: { parentPath?: any; node?: any }) {
        const { node } = path;

        if (
          t.isMemberExpression(node.left) &&
          t.isIdentifier(node.left.object, { name: 'dog' }) &&
          t.isIdentifier(node.left.property, { name: 'type' })
        ) {
          if (
            t.isBooleanLiteral(node.right) ||
            (t.isStringLiteral(node.right) &&
              ALLOWED_VALUES.includes(node.right.value))
          ) {
            path.parentPath.remove();
          }
        }
      },
    },
  };
}

export { removeQqiDogCall };

export default removeQqiDogCall;
