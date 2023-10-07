import styles from "../styles/SecondaryContainer.module.css";
import { Text, Timeline } from "@mantine/core";
import {
  IconGitBranch,
  IconGitPullRequest,
  IconGitCommit,
  IconMessageDots,
} from "@tabler/icons-react";

export default function SecondaryContainer() {
  return (
    <div className={styles.container}>
      <div className={styles.containerInfo}>
        <Text fw={900} size={"42px"} align="center">
          Que tal ver algumas de nossas vantagens?
        </Text>
        <Text style={{ width: "50ch" }} align="center">
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s. standard dummy text
        </Text>

        <div className={styles.containerVantagens}>

        </div>
      </div>
    </div>
  );
}
