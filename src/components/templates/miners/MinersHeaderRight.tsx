import Icon from "@/components/atoms/Icon";
import useTheme from "@/hooks/useTheme";
import { Link, useRouter } from "expo-router";
import type { ReactElement } from "react";
import React from "react";

function MinersHeaderRight(): ReactElement {
  const theme = useTheme();

  // FIX ME: onPress not working on phone because existing issue
  // https://github.com/expo/expo/issues/29489
  const router = useRouter();
  return (
    <>
      <Link
        //replace={true}
        href="/add-miner"
        style={{ color: theme.primaryColor }}
        onPressIn={() => router.navigate("/add-miner")}
      >
        <Icon name="plus" size={26} color={theme.primaryColor} />
      </Link>
      <Link
        //replace={true}
        href="/settings"
        style={{ color: theme.primaryColor }}
        onPressIn={() => router.navigate("/settings")}
      >
        <Icon name="cog-outline" size={26} color={theme.primaryColor} />
      </Link>
    </>
  );
}

export default MinersHeaderRight;
