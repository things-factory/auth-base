export async function checkUserMiddleware(context, next) {
  if (!context.state.user) {
    context.status = 401
    context.body = {
      success: false,
      message: context.state.error.message
    }
    return
  }
}
