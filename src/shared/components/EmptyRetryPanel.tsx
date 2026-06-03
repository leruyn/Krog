import React from 'react';
import {Pressable} from 'react-native';
import {Box, Text} from './primitives';
import {Card} from './Card';
import {Button} from './Button';

type BaseProps = {
  message: string;
  subtitle?: string;
  layout?: 'center' | 'inline';
  surface?: 'card' | 'plain';
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
};

export type EmptyRetryPanelProps =
  | (BaseProps & {variant: 'empty'})
  | (BaseProps & {
      variant: 'error';
      retryLabel: string;
      onRetry: () => void;
      retryLoading?: boolean;
    });

/**
 * EmptyRetryPanel
 *
 * Displays empty state or error state with optional retry button.
 *
 * Usage:
 *   // Empty state
 *   <EmptyRetryPanel variant="empty" message="No items found" />
 *
 *   // Error state with retry
 *   <EmptyRetryPanel
 *     variant="error"
 *     message="Failed to load"
 *     retryLabel="Try again"
 *     onRetry={refetch}
 *   />
 */
export function EmptyRetryPanel(props: EmptyRetryPanelProps) {
  const layout = props.layout ?? 'center';
  const centered = layout === 'center';
  const surface = props.surface ?? 'card';
  const messageColor = props.variant === 'empty' ? 'textSecondary' : 'text';

  const inner = (
    <>
      <Text variant="body" color={messageColor}>
        {props.message}
      </Text>
      {props.subtitle ? (
        <Text variant="caption" color="textSecondary" marginTop="sm">
          {props.subtitle}
        </Text>
      ) : null}
      {props.variant === 'error' ? (
        <Box marginTop="md">
          <Button
            title={props.retryLabel}
            onPress={props.onRetry}
            loading={props.retryLoading ?? false}
          />
        </Box>
      ) : null}
      {props.secondaryActionLabel && props.onSecondaryAction ? (
        <Pressable onPress={props.onSecondaryAction}>
          <Text variant="label" color="textSecondary" marginTop="md">
            {props.secondaryActionLabel}
          </Text>
        </Pressable>
      ) : null}
    </>
  );

  const wrapper =
    surface === 'plain' ? (
      <Box>{inner}</Box>
    ) : (
      <Card>{inner}</Card>
    );

  return (
    <Box
      flex={centered ? 1 : undefined}
      padding="lg"
      justifyContent={centered ? 'center' : undefined}
      alignItems={centered ? 'center' : undefined}>
      {wrapper}
    </Box>
  );
}
