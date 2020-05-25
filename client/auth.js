const DEFAULT_AUTH_REQUIRED_EVENT = 'auth-required'
const DEFAULT_ACTIVATE_REQUIRED_EVENT = 'activate-required'
const DEFAULT_ROUTE_PAGE = ''
const DEFAULT_CONTEXT_PATH = ''

const NOOP = () => {}

class ClientAuth {
  static initialize(props = {}) {
    if (ClientAuth._auth) {
      ClientAuth._auth.dispose()
    }

    ClientAuth._auth = new ClientAuth(props)
  }

  static get auth() {
    return ClientAuth._auth
  }

  constructor({
    provider,
    defaultRoutePage = DEFAULT_ROUTE_PAGE,
    contextPath = DEFAULT_CONTEXT_PATH,
    authRequiredEvent = DEFAULT_AUTH_REQUIRED_EVENT,
    activateRequiredEvent = DEFAULT_ACTIVATE_REQUIRED_EVENT,
    signupPath = 'signup',
    signinPath = 'signin',
    profilePath = 'profile',
    checkinPath = 'checkin',
    updateProfilePath = 'update-profile',
    changepassPath = 'change_pass',
    deleteAccountPath = 'delete-account',
    activatePage = 'activate',
    signinPage = 'signin',
    signupPage = 'signup',
    forgotPasswordPage = 'forgot-password',
    signoutPage,
    endpoint = ''
  }) {
    this._event_listeners = {
      signin: [],
      signout: [],
      profile: [],
      checkin: [],
      [authRequiredEvent]: [],
      changePassword: [],
      error: []
    }

    this.endpoint = endpoint

    this.authProvider = provider
    this.defaultRoutePage = defaultRoutePage
    this.contextPath = contextPath
    this.authRequiredEvent = authRequiredEvent
    this.activateRequiredEvent = activateRequiredEvent

    this.signupPath = signupPath
    this.signinPath = signinPath
    this.profilePath = profilePath
    this.checkinPath = checkinPath
    this.changepassPath = changepassPath
    this.updateProfilePath = updateProfilePath
    this.deleteAccountPath = deleteAccountPath

    this.activatePage = activatePage
    this.signinPage = signinPage
    this.signupPage = signupPage
    this.forgotPasswordPage = forgotPasswordPage
    this.signoutPage = signoutPage
  }

  on(event, handler) {
    var listeners = this._event_listeners[event]
    if (listeners) listeners.push(handler)
    else console.log('unknown event', event)
  }

  off(event, handler) {
    var listeners = this._event_listeners[event]
    if (listeners) {
      let idx = listeners.indexOf(handler)
      idx >= 0 && listeners.splice(idx, 1)
    } else {
      console.log('unknown event', event)
    }
  }

  dispose() {
    this.authRequiredEvent = null
    this.activateRequiredEvent = null
    delete this._event_listeners
  }

  /*
    fullpath는 리모트 서버로의 path를 찾는 메쏘드이다.
    endpoint의 영향을 받는다.
  */
  fullpath(relativePath) {
    return [this.endpoint ? this.endpoint : '/', relativePath]
      .filter(path => path && path !== '/')
      .map(path => (path.startsWith('/') ? path.substr(1) : path))
      .map(path => (path.endsWith('/') ? path.substr(0, path.length - 1) : path))
      .join('/')
  }

  /*
    fullpage는 싱글페이지 어플리케이션의 page를 찾는 메쏘드이다.
    contextPath의 영향을 받는다.
  */
  fullpage(relativePath) {
    return (
      '/' +
      [relativePath]
        .filter(path => path && path !== '/')
        .map(path => (path.startsWith('/') ? path.substr(1) : path))
        .map(path => (path.endsWith('/') ? path.substr(0, path.length - 1) : path))
        .join('/')
    )
  }

  set authProvider(provider) {
    //connect base with provider
    if (provider) {
      this.signup = provider.signup.bind(this)
      this.signin = provider.signin.bind(this)
      this.signout = provider.signout.bind(this)
      this.profile = provider.profile.bind(this)
      this.checkin = provider.checkin.bind(this)
      this.changePassword = provider.changePassword.bind(this)
      this.updateProfile = provider.updateProfile.bind(this)
      this.deleteAccount = provider.deleteAccount.bind(this)
    } else {
      this.signup = this.signin = this.signout = this.profile = this.checkin = this.changePassword = this.updateProfile = this.deleteAccount = NOOP
    }
  }

  get authRequiredEvent() {
    return this._authRequiredEvent
  }

  set authRequiredEvent(authRequiredEvent) {
    this._authRequiredEventListener &&
      document.removeEventListener(this.authRequiredEvent, this._authRequiredEventListener)

    this._authRequiredEvent = authRequiredEvent

    this._authRequiredEventListener = this.onAuthRequired.bind(this)
    this.authRequiredEvent && document.addEventListener(this.authRequiredEvent, this._authRequiredEventListener)
  }

  get activateRequiredEvent() {
    return this._activateRequiredEvent
  }

  set activateRequiredEvent(activateRequiredEvent) {
    this._activateRequiredEventListener &&
      document.removeEventListener(this.activateRequiredEvent, this._activateRequiredEventListener)

    this._activateRequiredEvent = activateRequiredEvent

    this._activateRequiredEventListener = this.onActivateRequired.bind(this)
    this.activateRequiredEvent &&
      document.addEventListener(this.activateRequiredEvent, this._activateRequiredEventListener)
  }

  onSignedIn({ accessToken, domains, redirectTo }) {
    this.accessToken = accessToken
    this.domains = domains

    this._event_listeners.signin.forEach(handler => handler({ accessToken, domains, redirectTo }))
  }

  onProfileFetched({ credential, accessToken, domains }) {
    this.credential = credential
    this.domains = domains
    if (accessToken && !this.accessToken) {
      /*
      기존에 세션을 가지거나, 액세스토큰으로 인증된 경우,
      이 경우는 signin 이벤트리스너들을 호출해서 authenticated 상태로 되도록 유도한다.
      */
      this.accessToken = accessToken
      this._event_listeners.signin.forEach(handler => handler({ accessToken, domains }))
    }
    accessToken && (this.accessToken = accessToken)
    this._event_listeners.profile.forEach(handler => handler({ credential, domains }))
  }

  onSignedOut() {
    this.credential = null
    this.domains = []
    this._event_listeners.signout.forEach(handler => handler())
  }

  onAuthError(error) {
    /* signin, signup 과정에서 에러가 발생한 경우 */
    this._event_listeners.error.forEach(handler => handler(error))
  }

  onPwdChanged(result) {
    //event is changePassword, handler is result
    this._event_listeners.changePassword.forEach(handler => handler(result))
  }

  onChangePwdError(error) {
    //listen from server error
    this._event_listeners.error.forEach(handler => handler(error))
  }

  onAuthRequired(e) {
    console.warn('authentication required')
    this._event_listeners[this.authRequiredEvent].forEach(handler => handler())
    // let url = new URL(window.location)

    // if (new RegExp(`/?${this.signinPage}`).test(url.pathname)) return

    // url.pathname = this.signinPage
    // url.searchParams.append('redirect_to', window.location.href)
    // window.location = url
  }

  onActivateRequired(e) {
    console.warn('activate required')
    window.location.replace(this.fullpage(`${this.activatePage}?email=${e.email}`))
  }

  openPage(page) {}

  route(path, redirected) {
    /* history에 남긴다. redirected된 상태임을 남긴다. */
    const location = window.location
    const origin = location.origin || location.protocol + '//' + location.host
    const href = `${origin}${path}`

    if (location.pathname === path) return

    // popstate 이벤트가 history.back() 에서만 발생하므로
    // 히스토리에 두번을 넣고 back()을 호출하는 편법을 사용함.
    // forward history가 한번 남는 문제가 있으나 signin 프로세스 중에만 발생하므로 큰 문제는 아님.
    // 이 로직은 login process가 어플리케이션 구조에 종속되는 것을 최소화하기 위함임.
    // 예를 들면, redux 구조에 들어가지 않아도 로그인 프로세스가 동작하도록 한 것임.
    window.history.pushState({ redirected }, '', href)
    window.history.pushState({}, '', href)

    window.history.back()
  }
}

ClientAuth.initialize()

export const auth = ClientAuth.auth
