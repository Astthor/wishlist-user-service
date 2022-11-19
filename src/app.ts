import express from 'express';
import { friendRoutes } from './routes/friend-routes';
import { inviteRoutes } from './routes/invite-routes';
import { relationshipRoutes } from './routes/relationship-routes';
import { userRoutes } from './routes/user-routes';
//import "dotenv/config";

const app = express();

const port = 3000;
app.use(express.json());
app.use("/user", userRoutes);
app.use("/friend", friendRoutes);
app.use("/invite", inviteRoutes);
app.use("/relationship", relationshipRoutes);

console.log("Environment = " + process.env.NODE_ENV);


app.get('/', (req, res) => {
	res.send('Hello World!')
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
});