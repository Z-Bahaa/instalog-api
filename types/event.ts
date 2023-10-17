export default interface InstaLogEvent {
  actor_id: string;
  actor_name: string;
  group: string;
  action: {
    name: string;
  };
  target_id: string;
  target_name: string;
  location: string;
  occurred_at: string;
  metadata: {
    redirect: string;
    description: string;
    x_request_id: string;
  };
}
