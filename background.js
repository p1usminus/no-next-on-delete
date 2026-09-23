browser.browserAction.onClicked.addListener(async tab => {
  try {
    if (!tab || tab.type !== "mail") {
      console.warn("No Next Message on Delete: not invoked from the mail tab.");
      return;
    }

    const selected = await browser.mailTabs.getSelectedMessages(tab.id);

    if (!selected || selected.messages.length === 0) {
      console.warn("No Next Message on Delete: no message selected.");
      return;
    }

    const ids = selected.messages.map(message => message.id);

    // Clear selection FIRST so Table view doesn't auto-advance to next message on delete
    try {
      await browser.mailTabs.setSelectedMessages(tab.id, []);
    } catch (selectionError) {
      console.error("No Next Message on Delete: could not clear selection before delete", selectionError);
    }

    await browser.messages.delete(ids, false);

    // Ensure selection remains clear after deletion
    try {
      await browser.mailTabs.setSelectedMessages(tab.id, []);
    } catch (selectionError) {
      console.error("No Next Message on Delete: could not clear selection after delete", selectionError);
    }
  } catch (error) {
    console.error("No Next Message on Delete: error in click handler", error);
  }
});
