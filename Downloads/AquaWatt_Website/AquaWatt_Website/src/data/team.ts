export type TeamMember = {
  name: string;
  role: string;
  avatar: string; // path under public/
  initials?: string;
  linkedin?: string;
  github?: string;
};

// Replace avatar paths with your actual images placed under public/team/
export const teamMembers: TeamMember[] = [
  { name: "Dinesh M", role: "Web Design & Developer", avatar: "/team/dinesh.jpg", initials: "DM", linkedin: "#" },
  { name: "Adhithya R", role: "UI/UX Designer", avatar: "/team/adhithya.jpg", initials: "AR", linkedin: "#" },
  { name: "Harish J", role: "IoT Technician", avatar: "/team/harish.jpg", initials: "HJ", linkedin: "#" },
];
