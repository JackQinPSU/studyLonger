import Page from "../components/Page";
import Card from "../components/Card";
import { PrimaryButton, SecondaryButton } from "../components/Button";
import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
    <Page title="Welcome to the Study Tracker" subtitle="Track focus. See progress.">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          Study longer.
        </h1>

        <p className="mt-4 text-lg text-neutral-500">
          Track focused study sessions and see clean weekly and monthly insights.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link to="/Login">
            <PrimaryButton>Log in</PrimaryButton>
          </Link>

          <Link to="/Login">
            <SecondaryButton>Get started</SecondaryButton>
          </Link>
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <Card>
          <p className="text-sm font-medium text-neutral-900">
            Start & stop sessions
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            One click to start focusing. One click to stop.
          </p>
        </Card>

        <Card>
          <p className="text-sm font-medium text-neutral-900">
            Weekly & monthly views
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            See exactly where your time goes.
          </p>
        </Card>

        <Card>
          <p className="text-sm font-medium text-neutral-900">
            Subject breakdowns
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Understand what you actually studied.
          </p>
        </Card>
      </div>
    </Page>
  );
}