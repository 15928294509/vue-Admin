import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    try {
      // get user info
      const response = await store.dispatch('user/getInfo')
      const rulelst = response.rulelst;
      const rule_ids = (response.userinfo.rule_ids).split(",");
      const ruleObj = {};
      //筛选出当前用户的权限路径
      const pathlist = rulelst.reduce((pre, rule) => {
        ruleObj[rule.name] = rule.id;
        if (rule_ids.includes(rule.id + "")) {
          pre.push(rule.name);
        }
        return pre;
      }, []);
      if (ruleObj[to.path]) {
        if (pathlist.indexOf(to.path) !== -1) {
          next();
        } else {
          Message.error("无权访问");
          next("/dashboard");
        }
      } else {
        next();
      }

      NProgress.done()
    } catch (error) {
      // remove token and go to login page to re-login
      await store.dispatch('user/resetToken')
      Message.error(error || 'Has Error')
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
