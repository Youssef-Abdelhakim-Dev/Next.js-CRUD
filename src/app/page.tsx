"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { Trash2, Loader2, PlusCircle, Edit } from "lucide-react";

export default function SupabaseUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // 🟢 Load all users
  async function loadUsers() {
    setLoading(true);
    const res = await fetch("/api/user");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // 🟢 Add user
  async function addUser() {
    if (!name || !email) return toast.error("Please enter name and email!");
    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    if (res.ok) {
      toast.success("User added!");
      setName("");
      setEmail("");
      loadUsers();
    }
  }

  // 🟡 Edit user
  async function editUser() {
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, name, email }),
    });
    if (res.ok) {
      toast.success("User updated!");
      setName("");
      setEmail("");
      setEditId(null);
      loadUsers();
    }
  }

  // 🔴 Delete user
  async function deleteUser(id: number) {
    const res = await fetch(`/api/user?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.info("User deleted");
      loadUsers();
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Supabase User Management
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            onClick={editId ? editUser : addUser}
            className="w-full flex items-center justify-center gap-2"
          >
            {editId ? "Update User" : "Add User"}
            <PlusCircle size={18} />
          </Button>

          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <ul className="space-y-2">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="flex justify-between items-center p-3 bg-white rounded shadow"
                >
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditId(u.id);
                        setName(u.name);
                        setEmail(u.email);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteUser(u.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Toaster richColors />
    </div>
  );
}
