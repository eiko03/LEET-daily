var url ={
    BASE_URL: 'https://leetcode.com',
    LOGIN_URL: 'https://leetcode.com/accounts/login/',
    API_URL: 'https://leetcode.com/graphql/'
}
var cookie_data = {
    SESSION:'LEETCODE_SESSION',
    CSRF:'csrftoken'
}

var whitelisted_url = {
    REGEX: ".*:\\/\\/.*leetcode\\.com\\/.*|.*:\\/\\/.*accounts\\.google\\.com\\/v3\\/signin\\/.*|.*:\\/\\/.*facebook\\.com\\/login.*|.*:\\/\\/.*github\\.com\\/login.*|.*:\\/\\/.*linkedin\\.com\\/uas\\/login.*|chrome:\\/\\/extensions.*"
}

var key_prefix = "leet_daily_"

var query =
{
    user_globaldata_query:      `
                                    query globalData {
                                        userStatus {
                                          userId
                                          isSignedIn
                                          username
                                          avatar
                                          activeSessionId
                                          checkedInToday
                                          notificationStatus {
                                            lastModified
                                            numUnread
                                          }
                                        }
                                    }
                               ` ,
    user_problems_solved_query:  `
                                    query userProblemsSolved($username: String!) {
                                        matchedUser(username: $username) {
                                                submitStatsGlobal {
                                                  acSubmissionNum {
                                                    difficulty
                                                    count
                                                  }
                                                }
                                        }
                                    }
                                ` ,
    problemset_question_list:   `
                                    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
                                      problemsetQuestionList: questionList(
                                        categorySlug: $categorySlug
                                        limit: $limit
                                        skip: $skip
                                        filters: $filters
                                      ) {
                                        total: totalNum
                                        questions: data {
                                          acRate
                                          difficulty
                                          freqBar
                                          frontendQuestionId: questionFrontendId
                                          isFavor
                                          paidOnly: isPaidOnly
                                          status
                                          title
                                          titleSlug
                                          topicTags {
                                            name
                                            id
                                            slug
                                          }
                                          hasSolution
                                          hasVideoSolution
                                        }
                                      }
                                    }
    
                                ` ,
    problemset_question_list_vr:`
                                    {"categorySlug": "", "skip": 12, "limit": 1,
                                     "filters": {
                                        "status": "NOT_STARTED"
                                      }
                                    }
    
                                ` ,
    leet_user_progress_list:
                                `query progressList($pageNo: Int, $numPerPage: Int, $filters: ProgressListFilterInput) {
                                  isProgressCalculated
                                  solvedQuestionsInfo(pageNo: $pageNo, numPerPage: $numPerPage, filters: $filters) {
                                    data {
                                      totalSolves
                                      question {
                                        questionFrontendId
                                        questionTitle
                                        questionDetailUrl
                                
                                      }
                                      lastAcSession {
                                        time
                                        wrongAttempts
                                      }
                                    }
                                  }
                                }                           
                                ` ,
    leet_user_progress_list_vr: `
                                    {"pageNo":1,"numPerPage":1,"filters":{"orderBy":"LAST_SOLVED","sortOrder":"DESCENDING"}}
                                ` ,
    leet_problem_question_list: `
                                    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
                                      problemsetQuestionList: questionList(
                                        categorySlug: $categorySlug
                                        limit: $limit
                                        skip: $skip
                                        filters: $filters
                                      ) {
                                        total: totalNum
                                        questions: data {
                                          acRate
                                          difficulty
                                          freqBar
                                          frontendQuestionId: questionFrontendId
                                          isFavor
                                          paidOnly: isPaidOnly
                                          status
                                          title
                                          titleSlug
                                          questionDetailUrl
                                    
                                        }
                                      }
                                    }
    
                                ` ,

    leet_problem_question_list_vr:
                                `
                                    {"categorySlug": "", "skip": 0, "limit": 1, "filters": {    "status": "NOT_STARTED" }}
                                `
}
var storage = chrome.storage.local;

const methods = {
    post: 'POST',
    get: 'GET',
    update: 'UPDATE',
    delete: 'DELETE'
};

const fallback={
    date: "2000-04-28T16:01:49+00:00"
}

export { url, cookie_data, whitelisted_url,key_prefix,storage,query,methods,fallback }