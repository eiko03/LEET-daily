var query = `
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
            `