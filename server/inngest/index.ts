import { Inngest } from "inngest";
import User from "../models/User";

export const inngest = new Inngest({ id: "pingup-rec2026" });

// Clerk'dan kelgan foydalanuvchini bazaga saqlaydi
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-form-clerk",
    triggers: { event: "clerk/user.created" },
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const email = email_addresses?.[0]?.email_address;
    if (!email) {
      throw new Error(`User ${id} has no email address`);
    }

    // Idempotentlik: foydalanuvchi allaqachon bor bo'lsa, qayta yaratmaymiz
    const existing = await User.findById(id);
    if (existing) return { skipped: true };

    // Username tanlash
    const base = email.split("@")[0];
    let username = base;
    while (await User.exists({ username })) {
      username = base + Math.floor(Math.random() * 10000);
    }

    await User.create({
      _id: id,
      email,
      full_name: first_name + " " + last_name,
      profile_picture: image_url,
      username,
    });
  },
);
const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-form-clerk",
    triggers: { event: "clerk/user.updated" },
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const updatedUserData = {
      email: email_addresses[0].email_address,
      full_name: first_name + "" + last_name,
      profile_picture: image_url,
    };
    await User.findByIdAndUpdate(id, updatedUserData);
  },
);
const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-form-clerk",
    triggers: { event: "clerk/user.deleted" },
  },
  async ({ event }) => {
    const { id } = event.data;

    await User.findByIdAndDelete(id);
  },
);

export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion];
