import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import AppModal from "@/components/AppModal"
import api from "@/services/api";


// const dataUsers = [
//   {
//     id: 1,
//     name: "Reza",
//     email: "ribrahim50@gmail.com",
//     password: 12345678,
//   },
//   {
//     id: 2,
//     name: "Budi",
//     email: "budi@gmail.com",
//     password: 12345678,
//   },
//   {
//     id: 3,
//     name: "ani",
//     email: "ani@gmail.com",
//     password: 12345678,
//   },
// ];

const ListUser = () => {
  const _initForm = {
    id: null,
    name: "",
    email: "",
    password: "",
    is_active: 1,
  };

  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(_initForm);
  const [isEdit, setIsEdit] = useState(false);
  const fetchUser = async () => {
    try {
      const response = await api.get("/user")
      setUsers(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const handleOpenModal = () => {
    setShowModal(true);
    setFormData(_initForm);
    setIsEdit(false);
  };

  const handleEditModal = (user) => {
    console.log(user);
    setShowModal(true);
    setIsEdit(true);
    setFormData(user);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // jika edit data

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        is_active: parseInt(formData.is_active),
      }
      if (isEdit) {
        console.log(formData)
        await api.put(`/user/${formData.id}`, payload)
        // setUsers(users.map((user) => (user.id === formData.id ? formData : user)));
      } else {
        await api.post("/user", payload)
      }
      //   name: formData.name,
      //   email: formData.email,
      //   password: formData.password,
      //   is_active: parseInt(formData.is_active)
      // })
      setFormData(_initForm);
    } catch (error) {
      const errMsg = error.message
      console.log(errMsg)
    } finally {
      fetchUser()
      setShowModal(false);
    }
    // const newUser = {
    //   ...formData,
    //   id: Date.now(),
    // };
    // setUsers([...users, newUser]); 
  }
  const handleDelete = async (id) => {
    const confirmation = window.confirm("Are you sure want to delete this data?");
    if (confirmation) {
      await api.delete(`/user/${id}`);
      fetchUser();
      // setUsers(users.filter((u) => u.id !== id));
    }
    // filter: users
  };

  return (
    <>
      <Card className="shadow-sm border-border p-6">
        <CardHeader className="">
          <div className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-bold"> Data User</CardTitle>
            <Button onClick={handleOpenModal}>
              Create New User
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-y bg-muted/30 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">#</th>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="text-right pr-14 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-6 whitespace-nowrap">{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`border rounded-sm p-2 $ {user.is_active === 1 "bg-green-300 : "bg-red-500"}
                      text-black`}
                      >{user.is_active === 1 ? "active" : " in-active"}</span>
                    </td>
                    <td className="px-4 py-6 text-right whitespace-nowrap">
                      <Button onClick={() => handleEditModal(user)} variant="warning" size="sm"
                        className="border rounded-sm bg-blue-300 me-2">
                        Edit
                      </Button>
                      <Button onClick={() => handleDelete(user.id)} variant="destructive" size="sm" className="me-2">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">
                    Belum ada data user
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create New User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" placeholder="Enter your name" required value={formData.name} onChange={handleChange}></Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control value={formData.email} onChange={handleChange} type="email" name="email" placeholder="Enter your email" required></Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control value={formData.password} onChange={handleChange} type="password" name="password" placeholder="Enter your passwod" required></Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button type="submit" variant="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal> */}

      <AppModal show={showModal} onClose={() => setShowModal(false)} title={isEdit ? "Edit User" : "Create New User"}
      onSubmit={handleSubmit} submitLabel={isEdit ? "Save Change" : "Save"}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              required value={formData.name}
              onChange={handleChange} />
          </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input id="email"
              name="email"
              required value={formData.email} onChange={handleChange}
              placeholder="Enter your email" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input id="password"
              name="password"
              onChange={handleChange} 
              required={isEdit ? false : true}
              value={formData.password}
              placeholder="Enter your password" />
          </div>
          <div className="mb-3">
            <Label htmlFor="is_active">Status</Label>
            <select id="is_active" name="is_active" value={formData.is_active ?? 1} onChange={handleChange} required>
              <option value={1}>Active</option>
              <option value={0}>In Active</option>
            </select>
          </div>
      </AppModal>
    </>
  );
}
{/* <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" placeholder="Enter your name" required value={formData.name} onChange={handleChange}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control value={formData.email} onChange={handleChange} type="email" name="email" placeholder="Enter your email" required></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control value={formData.password} onChange={handleChange} type="password" name="password" placeholder="Enter your passwod" required></Form.Control>
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange}>
                <option value="">Select One</option>
                <option value="Active">Publish</option>
                <option value="In Active">Draft</option>
              </Form.Select>
            </Form.Group>
          </Form> */}

export default ListUser;
